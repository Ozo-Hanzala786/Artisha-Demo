import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const status = searchParams.get('status');

    const where: any = {};
    if (query) {
      where.OR = [
        { orderNumber: { contains: query } },
        { guestName: { contains: query } },
        { guestPhone: { contains: query } },
        { city: { contains: query } },
        { trackingNumber: { contains: query } },
      ];
    }
    if (status && status !== 'ALL') {
      where.orderStatus = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
