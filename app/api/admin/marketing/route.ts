import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [subscribers, reviews] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } }),
      prisma.review.findMany({
        include: { product: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({ subscribers, reviews });
  } catch (error) {
    console.error('Error fetching marketing data:', error);
    return NextResponse.json({ error: 'Failed to fetch marketing data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reviewId, status } = await req.json();

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error: any) {
    console.error('Error updating review status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update review' }, { status: 400 });
  }
}
