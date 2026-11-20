import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      price,
      salePrice,
      costPrice,
      stock,
      lowStockThreshold,
      isFeatured,
      isBestseller,
      isNewArrival,
      status,
      categoryId,
      images,
      material,
      careInstructions,
      seoTitle,
      seoDescription,
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(sku && { sku }),
        ...(description !== undefined && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(price !== undefined && { price: parseFloat(price) }),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        ...(costPrice !== undefined && { costPrice: parseFloat(costPrice) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold: parseInt(lowStockThreshold) }),
        ...(isFeatured !== undefined && { isFeatured: !!isFeatured }),
        ...(isBestseller !== undefined && { isBestseller: !!isBestseller }),
        ...(isNewArrival !== undefined && { isNewArrival: !!isNewArrival }),
        ...(status && { status }),
        ...(categoryId && { categoryId }),
        ...(images && { images: typeof images === 'string' ? images : JSON.stringify(images) }),
        ...(material !== undefined && { material }),
        ...(careInstructions !== undefined && { careInstructions }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
      },
      include: { category: true, variants: true },
    });

    // Record audit log
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UPDATE_PRODUCT',
      entityType: 'Product',
      entityId: updatedProduct.id,
      details: `Updated details for "${updatedProduct.name}" (SKU: ${updatedProduct.sku})`,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Instead of hard-deleting which breaks order history foreign keys, archive the product or delete if no orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // Archive product safely
      await prisma.product.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });
    } else {
      await prisma.stockMovement.deleteMany({ where: { productId: id } });
      await prisma.review.deleteMany({ where: { productId: id } });
      await prisma.wishlist.deleteMany({ where: { productId: id } });
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });
    }

    // Record audit log
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'DELETE_OR_ARCHIVE_PRODUCT',
      entityType: 'Product',
      entityId: id,
      details: `Archived/Removed product "${existingProduct.name}"`,
    });

    return NextResponse.json({ success: true, message: 'Product removed successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 400 });
  }
}
