import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber')?.trim().toUpperCase();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order reference is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: `Order "${orderNumber}" could not be found.` }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingMethod: order.shippingMethod,
        shippingAddress: order.shippingAddress,
        city: order.city,
        trackingNumber: order.trackingNumber,
        courierName: order.courierName,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items,
      },
    });
  } catch (error) {
    console.error('Order tracking lookup error:', error);
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 });
  }
}
