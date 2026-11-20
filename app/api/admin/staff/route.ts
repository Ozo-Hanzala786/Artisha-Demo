import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const staffMembers = await prisma.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'MANAGER', 'INVENTORY_MANAGER', 'ORDER_MANAGER', 'MARKETING_MANAGER'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ staffMembers });
  } catch (error) {
    console.error('Error fetching staff members:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const { name, email, password, role, phone } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        phone: phone || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_STAFF_MEMBER',
      entityType: 'User',
      entityId: newStaff.id,
      details: `Created staff account for ${newStaff.name} with role ${newStaff.role}`,
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error: any) {
    console.error('Error creating staff member:', error);
    return NextResponse.json({ error: error.message || 'Failed to create staff' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required' }, { status: 403 });
    }

    const { id, role, isActive } = await req.json();

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive: !!isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_STAFF_PERMISSIONS',
      entityType: 'User',
      entityId: id,
      details: `Updated staff permissions for ${updated.name}: Role=${updated.role}, Active=${updated.isActive}`,
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (error: any) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: error.message || 'Failed to update staff' }, { status: 400 });
  }
}
