import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const categoryId = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { sku: { contains: query } },
        { description: { contains: query } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
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
      variants,
    } = body;

    if (!name || !sku || !price || !categoryId) {
      return NextResponse.json({ error: 'Name, SKU, Price, and Category are required' }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        sku,
        description: description || '',
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : 0,
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        isFeatured: !!isFeatured,
        isBestseller: !!isBestseller,
        isNewArrival: !!isNewArrival,
        status: status || 'PUBLISHED',
        categoryId,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        material: material || null,
        careInstructions: careInstructions || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        variants: variants && variants.length > 0 ? {
          create: variants.map((v: any) => ({
            sku: v.sku || `${sku}-${v.name.replace(/\s+/g, '')}`,
            name: v.name,
            size: v.size || null,
            color: v.color || null,
            stock: parseInt(v.stock) || 0,
          })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    // Record stock movement
    if (newProduct.stock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: newProduct.id,
          type: 'RESTOCK',
          quantity: newProduct.stock,
          reason: 'Initial creation stock allocation',
          userId: user.id,
        },
      });
    }

    // Record audit log
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'CREATE_PRODUCT',
      entityType: 'Product',
      entityId: newProduct.id,
      details: `Created product "${newProduct.name}" (SKU: ${newProduct.sku}) priced at Rs. ${newProduct.price}`,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 400 });
  }
}
