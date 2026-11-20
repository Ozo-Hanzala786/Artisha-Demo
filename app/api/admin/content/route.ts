import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const contents = await prisma.websiteContent.findMany();
    const map: { [key: string]: any } = {};
    contents.forEach((c) => {
      try {
        map[c.key] = JSON.parse(c.value);
      } catch {
        map[c.key] = c.value;
      }
    });

    return NextResponse.json({ content: map });
  } catch (error) {
    console.error('Error fetching website content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await req.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);

    const updated = await prisma.websiteContent.upsert({
      where: { key },
      update: { value: stringVal },
      create: { key, value: stringVal },
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_WEBSITE_CONTENT',
      entityType: 'WebsiteContent',
      entityId: key,
      details: `Updated website content key "${key}"`,
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 400 });
  }
}
