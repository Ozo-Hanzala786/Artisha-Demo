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

    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category, amount, date, description, receiptUrl } = await req.json();

    if (!title || !category || !amount) {
      return NextResponse.json({ error: 'Title, category, and amount are required' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        category,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        description: description || null,
        receiptUrl: receiptUrl || null,
        recordedBy: user.name,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'RECORD_EXPENSE',
      entityType: 'Expense',
      entityId: expense.id,
      details: `Recorded ${expense.category} expense "${expense.title}" of Rs. ${expense.amount}`,
    });

    return NextResponse.json({ success: true, expense });
  } catch (error: any) {
    console.error('Error recording expense:', error);
    return NextResponse.json({ error: error.message || 'Failed to record expense' }, { status: 400 });
  }
}
