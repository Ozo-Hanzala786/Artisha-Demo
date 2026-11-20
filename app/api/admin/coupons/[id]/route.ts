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

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...(body.code && { code: body.code.trim().toUpperCase() }),
        ...(body.discountType && { discountType: body.discountType }),
        ...(body.value !== undefined && { value: parseFloat(body.value) }),
        ...(body.minSpend !== undefined && { minSpend: parseFloat(body.minSpend) }),
        ...(body.maxDiscount !== undefined && { maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit ? parseInt(body.usageLimit) : null }),
        ...(body.expiresAt !== undefined && { expiresAt: body.expiresAt ? new Date(body.expiresAt) : null }),
        ...(body.isActive !== undefined && { isActive: !!body.isActive }),
      },
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_COUPON',
      entityType: 'Coupon',
      entityId: id,
      details: `Updated coupon ${updated.code}`,
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: error.message || 'Failed to update coupon' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.coupon.delete({ where: { id } });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'DELETE_COUPON',
      entityType: 'Coupon',
      entityId: id,
      details: `Deleted coupon ID ${id}`,
    });

    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete coupon' }, { status: 400 });
  }
}
