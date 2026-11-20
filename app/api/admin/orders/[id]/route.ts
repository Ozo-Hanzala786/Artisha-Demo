import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { orderStatus, paymentStatus, trackingNumber, courierName, internalNotes } = body;

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) throw new Error('Order not found');

      const previousStatus = order.orderStatus;
      const willCancelOrReturn = (orderStatus === 'CANCELLED' || orderStatus === 'RETURNED' || orderStatus === 'REFUNDED') &&
        (previousStatus !== 'CANCELLED' && previousStatus !== 'RETURNED' && previousStatus !== 'REFUNDED');

      // Automatic stock restoration if cancelled or returned
      if (willCancelOrReturn) {
        for (const item of order.items) {
          // Restore product stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });

          // Restore variant stock if variant exists
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }

          // Record stock movement for audit
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              type: 'ORDER_RESTORE',
              quantity: item.quantity,
              reason: `Order ${order.orderNumber} ${orderStatus}`,
              referenceNote: `Restored by ${user.name}`,
              userId: user.id,
            },
          });
        }
      }

      // Update Order
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus }),
          ...(trackingNumber !== undefined && { trackingNumber }),
          ...(courierName !== undefined && { courierName }),
          ...(internalNotes !== undefined && { internalNotes }),
        },
        include: { items: true, payments: true },
      });

      return { order: updatedOrder, previousStatus };
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'Order',
      entityId: id,
      details: `Status changed from ${result.previousStatus} to ${orderStatus || result.order.orderStatus}. Tracking: ${trackingNumber || result.order.trackingNumber || 'none'}`,
    });

    return NextResponse.json({ success: true, order: result.order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 400 });
  }
}
