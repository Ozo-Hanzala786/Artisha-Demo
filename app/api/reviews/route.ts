import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { productId, authorName, rating, comment } = await req.json();

    if (!productId || !authorName || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        authorName: authorName.trim(),
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment.trim(),
        userId: user?.id || null,
        isVerifiedPurchase: !!user,
        status: 'APPROVED', // Default to approved for immediate boutique social proof
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
