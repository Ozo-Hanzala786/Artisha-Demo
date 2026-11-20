import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { city: 'asc' },
    });
    return NextResponse.json({ zones });
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { city, rate, estimatedDays, freeShippingThreshold, isActive } = await req.json();

    if (!city || rate === undefined) {
      return NextResponse.json({ error: 'City and rate are required' }, { status: 400 });
    }

    const zone = await prisma.shippingZone.upsert({
      where: { city },
      update: {
        rate: parseFloat(rate),
        estimatedDays: estimatedDays || '2-3 business days',
        freeShippingThreshold: freeShippingThreshold ? parseFloat(freeShippingThreshold) : null,
        isActive: isActive !== undefined ? !!isActive : true,
      },
      create: {
        city,
        rate: parseFloat(rate),
        estimatedDays: estimatedDays || '2-3 business days',
        freeShippingThreshold: freeShippingThreshold ? parseFloat(freeShippingThreshold) : 10000,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_SHIPPING_ZONE',
      entityType: 'ShippingZone',
      entityId: zone.id,
      details: `Configured shipping zone for ${zone.city}: Rs. ${zone.rate}`,
    });

    return NextResponse.json({ success: true, zone });
  } catch (error: any) {
    console.error('Error updating shipping zone:', error);
    return NextResponse.json({ error: error.message || 'Failed to update shipping zone' }, { status: 400 });
  }
}
