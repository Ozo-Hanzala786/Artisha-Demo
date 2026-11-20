import prisma from './prisma';

export async function recordAuditLog({
  userId,
  userName,
  userRole,
  action,
  entityType,
  entityId,
  details,
}: {
  userId?: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userName,
        userRole,
        action,
        entityType,
        entityId: entityId || null,
        details: details || null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
