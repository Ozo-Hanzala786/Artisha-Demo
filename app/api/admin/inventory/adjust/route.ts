import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, variantId, type, quantity, reason, referenceNote } = await req.json();

    if (!productId || !type || quantity === undefined || !reason) {
      return NextResponse.json({ error: 'Product, type, quantity, and reason are required' }, { status: 400 });
    }

    const qtyNumber = parseInt(quantity);
    if (isNaN(qtyNumber)) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new Error('Product not found');

      // Update Variant stock if variantId provided
      if (variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
        if (variant) {
          const newVariantStock = Math.max(0, variant.stock + qtyNumber);
          await tx.productVariant.update({
            where: { id: variantId },
            data: { stock: newVariantStock },
          });
        }
      }

      // Update Product total stock
      const newStock = Math.max(0, product.stock + qtyNumber);
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      // Create StockMovement record
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          variantId: variantId || null,
          type,
          quantity: qtyNumber,
          reason,
          referenceNote: referenceNote || null,
          userId: user.id,
        },
      });

      // Trigger low stock notification if necessary
      if (newStock <= product.lowStockThreshold && newStock > 0) {
        await tx.notification.create({
          data: {
            type: 'STOCK_LOW',
            title: 'Low Stock Alert',
            message: `Product "${product.name}" has reached low stock threshold (${newStock} remaining).`,
            link: '/admin/inventory',
          },
        });
      } else if (newStock === 0) {
        await tx.notification.create({
          data: {
            type: 'STOCK_OUT',
            title: 'Out of Stock Alert',
            message: `Product "${product.name}" is now completely out of stock.`,
            link: '/admin/inventory',
          },
        });
      }

      return { product: updatedProduct, movement };
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'STOCK_ADJUSTMENT',
      entityType: 'Product',
      entityId: productId,
      details: `${type} of ${qtyNumber > 0 ? '+' : ''}${qtyNumber} units for "${result.product.name}". Reason: ${reason}`,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Stock adjustment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to adjust stock' }, { status: 400 });
  }
}
