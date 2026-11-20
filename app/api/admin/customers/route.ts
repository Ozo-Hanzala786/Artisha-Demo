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

    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        orders: {
          select: { id: true, totalAmount: true, createdAt: true, orderStatus: true },
        },
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => {
      const validOrders = c.orders.filter((o) => o.orderStatus !== 'CANCELLED');
      const totalSpent = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      let segment = 'New';
      if (totalSpent > 50000 || validOrders.length >= 3) segment = 'VIP Patron';
      else if (validOrders.length >= 1) segment = 'Regular';

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        totalSpent,
        orderCount: c.orders.length,
        segment,
        addresses: c.addresses,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({ customers: formatted });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
