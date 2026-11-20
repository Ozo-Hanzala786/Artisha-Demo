import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json({ products: [] });
    }

    const ids = idsParam.split(',').filter(Boolean);

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        status: 'PUBLISHED',
      },
      include: { category: true },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Batch product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
