import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    const body = await req.json();

    const {
      guestName,
      guestEmail,
      guestPhone,
      shippingAddress,
      city,
      postalCode,
      shippingMethod,
      paymentMethod,
      couponCode,
      customerNotes,
      items,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !city) {
      return NextResponse.json({ error: 'Shipping address and city are required' }, { status: 400 });
    }

    const contactName = sessionUser ? sessionUser.name : guestName;
    const contactEmail = sessionUser ? sessionUser.email : guestEmail;
    const contactPhone = guestPhone;

    if (!contactName || !contactPhone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    // Run transaction for atomic stock validation, order creation, and stock deduction
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];
      const lowStockAlerts = [];
      const outOfStockAlerts = [];

      // 1. Verify stock and calculate verified subtotal directly from database records
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product || product.status !== 'PUBLISHED') {
          throw new Error(`Product "${item.name}" is no longer available.`);
        }

        // Variant-level stock check
        let variant = null;
        if (item.variantId) {
          variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant) {
            throw new Error(`Selected variant of "${product.name}" is invalid.`);
          }
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for "${product.name} (${variant.name})". Available: ${variant.stock}`);
          }
        } else {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
          }
        }

        const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        orderItemsData.push({
          productId: product.id,
          variantId: variant ? variant.id : null,
          name: variant ? `${product.name} - ${variant.name}` : product.name,
          sku: variant ? variant.sku : product.sku,
          price: unitPrice,
          quantity: item.quantity,
          subtotal: lineTotal,
          imageUrl: item.image || (JSON.parse(product.images)[0] || ''),
        });

        // Deduct variant stock
        if (variant) {
          const updatedVariantStock = variant.stock - item.quantity;
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: updatedVariantStock },
          });
        }

        // Deduct main product stock
        const updatedProductStock = product.stock - item.quantity;
        await tx.product.update({
          where: { id: product.id },
          data: { stock: updatedProductStock },
        });

        // Check for low/out of stock
        if (updatedProductStock <= 0) {
          outOfStockAlerts.push(product.name);
        } else if (updatedProductStock <= product.lowStockThreshold) {
          lowStockAlerts.push({ name: product.name, stock: updatedProductStock });
        }
      }

      // 2. Validate Coupon and calculate discount
      let discountAmount = 0;
      let appliedCode = null;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.trim().toUpperCase() },
        });

        if (
          coupon &&
          coupon.isActive &&
          (!coupon.expiresAt || new Date() <= new Date(coupon.expiresAt)) &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
          subtotal >= coupon.minSpend
        ) {
          appliedCode = coupon.code;
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else if (coupon.discountType === 'FIXED') {
            discountAmount = Math.min(coupon.value, subtotal);
          }

          // Increment coupon usage
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: coupon.usedCount + 1 },
          });
        }
      }

      // 3. Shipping cost
      let shippingCost = 250;
      if (shippingMethod === 'STORE_PICKUP') {
        shippingCost = 0;
      } else if (subtotal >= 10000 || (appliedCode && (await tx.coupon.findUnique({ where: { code: appliedCode } }))?.discountType === 'FREE_SHIPPING')) {
        shippingCost = 0;
      } else if (city.toLowerCase().trim() === 'lahore') {
        shippingCost = 150;
      }

      const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

      // Generate order number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const count = await tx.order.count();
      const orderNumber = `ART-${10000 + count + 1}`;

      // 4. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: sessionUser ? sessionUser.id : null,
          guestName: contactName,
          guestEmail: contactEmail,
          guestPhone: contactPhone,
          shippingAddress,
          city,
          postalCode: postalCode || null,
          shippingMethod: shippingMethod || 'STANDARD',
          shippingCost,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          orderStatus: 'PENDING',
          subtotal,
          discountAmount: Math.round(discountAmount),
          couponCode: appliedCode,
          totalAmount,
          customerNotes: customerNotes || null,
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: totalAmount,
              paymentMethod: paymentMethod || 'COD',
              status: 'PENDING',
              notes: `Order created via ${paymentMethod || 'COD'}`,
            },
          },
        },
      });

      // 5. Record Stock Movement for each item
      for (const item of orderItemsData) {
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            type: 'ORDER_DEDUCT',
            quantity: -item.quantity,
            reason: `Order ${orderNumber}`,
            referenceNote: `Purchased by ${contactName}`,
            userId: sessionUser?.id || null,
          },
        });
      }

      // 6. In-dashboard Admin Notification
      await tx.notification.create({
        data: {
          type: 'ORDER_NEW',
          title: 'New Order Received',
          message: `Order #${orderNumber} placed by ${contactName} for Rs. ${totalAmount.toLocaleString()} (${city}).`,
          link: `/admin/orders`,
        },
      });

      // Low stock notifications
      for (const alert of lowStockAlerts) {
        await tx.notification.create({
          data: {
            type: 'STOCK_LOW',
            title: 'Low Stock Alert',
            message: `Product "${alert.name}" is running low with only ${alert.stock} units remaining.`,
            link: `/admin/inventory`,
          },
        });
      }

      for (const name of outOfStockAlerts) {
        await tx.notification.create({
          data: {
            type: 'STOCK_OUT',
            title: 'Out of Stock Alert',
            message: `Product "${name}" is now completely out of stock.`,
            link: `/admin/inventory`,
          },
        });
      }

      return newOrder;
    });

    // Record audit log
    await recordAuditLog({
      userId: sessionUser?.id,
      userName: sessionUser?.name || contactName,
      userRole: sessionUser?.role || 'CUSTOMER',
      action: 'CREATE_ORDER',
      entityType: 'Order',
      entityId: result.id,
      details: `Placed order ${result.orderNumber} for Rs. ${result.totalAmount}`,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        orderNumber: result.orderNumber,
        totalAmount: result.totalAmount,
        paymentMethod: result.paymentMethod,
        orderStatus: result.orderStatus,
      },
    });
  } catch (error: any) {
    console.error('Order placement error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 400 });
  }
}
