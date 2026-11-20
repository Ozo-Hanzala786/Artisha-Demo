import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await prisma.paymentTransaction.findMany({
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, notes } = await req.json();

    const updated = await prisma.$transaction(async (tx) => {
      const trx = await tx.paymentTransaction.update({
        where: { id },
        data: {
          status,
          notes: notes || undefined,
          verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
        },
      });

      // Also update parent Order payment status
      await tx.order.update({
        where: { id: trx.orderId },
        data: { paymentStatus: status },
      });

      return trx;
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'VERIFY_PAYMENT',
      entityType: 'PaymentTransaction',
      entityId: id,
      details: `Payment transaction ${id} marked as ${status}`,
    });

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Failed to update payment' }, { status: 400 });
  }
}
