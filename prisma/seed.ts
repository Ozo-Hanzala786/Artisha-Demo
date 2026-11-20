import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Artisha database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.shippingZone.deleteMany();
  await prisma.websiteContent.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Password hashes
  const adminPass = await bcrypt.hash('adminpassword123', 10);
  const managerPass = await bcrypt.hash('managerpassword123', 10);
  const staffPass = await bcrypt.hash('staffpassword123', 10);
  const customerPass = await bcrypt.hash('customerpassword123', 10);

  // 1. Staff and Users
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Syeda Fatima (CEO & Founder)',
      email: 'admin@artisha.pk',
      passwordHash: adminPass,
      role: 'SUPER_ADMIN',
      phone: '+92 300 8472910',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Hamza Malik (Operations Manager)',
      email: 'manager@artisha.pk',
      passwordHash: managerPass,
      role: 'MANAGER',
      phone: '+92 321 4455667',
    },
  });

  const inventoryManager = await prisma.user.create({
    data: {
      name: 'Ayesha Tariq (Inventory Lead)',
      email: 'inventory@artisha.pk',
      passwordHash: staffPass,
      role: 'INVENTORY_MANAGER',
      phone: '+92 333 1122334',
    },
  });

  const orderManager = await prisma.user.create({
    data: {
      name: 'Bilal Khan (Fulfillment & Dispatch)',
      email: 'orders@artisha.pk',
      passwordHash: staffPass,
      role: 'ORDER_MANAGER',
      phone: '+92 345 9988776',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Zainab Qureshi',
      email: 'customer@artisha.pk',
      passwordHash: customerPass,
      role: 'CUSTOMER',
      phone: '+92 301 5566778',
      addresses: {
        create: [
          {
            title: 'Home',
            recipientName: 'Zainab Qureshi',
            phone: '+92 301 5566778',
            streetAddress: 'House 42, Sector Y, Phase 3, DHA',
            city: 'Lahore',
            postalCode: '54792',
            province: 'Punjab',
            isDefault: true,
          },
        ],
      },
    },
  });

  // 2. Shipping Zones (Pakistan)
  const shippingZones = [
    { city: 'Lahore', rate: 150, estimatedDays: '1-2 business days', freeShippingThreshold: 8000 },
    { city: 'Karachi', rate: 250, estimatedDays: '2-3 business days', freeShippingThreshold: 10000 },
    { city: 'Islamabad', rate: 250, estimatedDays: '2-3 business days', freeShippingThreshold: 10000 },
    { city: 'Rawalpindi', rate: 250, estimatedDays: '2-3 business days', freeShippingThreshold: 10000 },
    { city: 'Faisalabad', rate: 250, estimatedDays: '2-4 business days', freeShippingThreshold: 10000 },
    { city: 'Multan', rate: 250, estimatedDays: '2-4 business days', freeShippingThreshold: 10000 },
    { city: 'Peshawar', rate: 300, estimatedDays: '3-4 business days', freeShippingThreshold: 12000 },
    { city: 'Quetta', rate: 350, estimatedDays: '4-5 business days', freeShippingThreshold: 15000 },
    { city: 'Other Cities', rate: 300, estimatedDays: '3-5 business days', freeShippingThreshold: 10000 },
  ];

  for (const zone of shippingZones) {
    await prisma.shippingZone.create({ data: zone });
  }

  // 3. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'ARTISHA10',
        discountType: 'PERCENTAGE',
        value: 10,
        minSpend: 5000,
        maxDiscount: 3000,
        usageLimit: 200,
        usedCount: 24,
        isActive: true,
      },
      {
        code: 'WELCOME1000',
        discountType: 'FIXED',
        value: 1000,
        minSpend: 8000,
        usageLimit: 100,
        usedCount: 15,
        isActive: true,
      },
      {
        code: 'FREESHIP',
        discountType: 'FREE_SHIPPING',
        value: 0,
        minSpend: 3000,
        usageLimit: 500,
        usedCount: 42,
        isActive: true,
      },
      {
        code: 'FESTIVE15',
        discountType: 'PERCENTAGE',
        value: 15,
        minSpend: 15000,
        maxDiscount: 5000,
        usageLimit: 50,
        usedCount: 8,
        isActive: true,
      },
    ],
  });

  // 4. Categories
  const catPret = await prisma.category.create({
    data: {
      name: 'Pret & Ready-to-Wear',
      slug: 'pret-ready-to-wear',
      description: 'Artisanal daily couture blending timeless heritage cuts with contemporary silhouettes.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 1,
    },
  });

  const catFestive = await prisma.category.create({
    data: {
      name: 'Luxury Festive',
      slug: 'luxury-festive',
      description: 'Opulent ceremonial ensembles adorned with authentic hand-zardozi, tilla, and marori embroidery.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 2,
    },
  });

  const catShawls = await prisma.category.create({
    data: {
      name: 'Artisanal Shawls & Stoles',
      slug: 'artisanal-shawls',
      description: 'Handwoven pure wool, pashmina, and silk stoles crafted by master weavers.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 3,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Handcrafted Accessories & Bags',
      slug: 'handcrafted-accessories',
      description: 'Embellished velvet potlis, raw silk clutches, and artisanal khussas.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 4,
    },
  });

  const catJewelry = await prisma.category.create({
    data: {
      name: 'Bespoke Jewelry',
      slug: 'bespoke-jewelry',
      description: 'Semi-precious stone ornaments, silver filigree jhumkas, and royal polki heirlooms.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 5,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: 'Home & Living Art',
      slug: 'home-living-art',
      description: 'Curated artisanal home accents, hand-block printed textiles, and carved brass wares.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      featured: false,
      displayOrder: 6,
    },
  });

  // 5. Products
  const productsData = [
    {
      name: 'Crimson Velvet Embroidered Kurta Set',
      slug: 'crimson-velvet-embroidered-kurta-set',
      sku: 'ART-VEL-001',
      description: 'Crafted in deep burgundy micro-velvet, this tunic features intricate antique dabka, nakshi, and marori embroidery along the neckline and cuffs. Paired with straight-cut raw silk trousers and a contrasting organza dupatta bordered in scallop lace.',
      shortDescription: 'Deep crimson micro-velvet tunic with intricate gold dabka embroidery and organza dupatta.',
      price: 24500,
      salePrice: 21990,
      costPrice: 11000,
      stock: 18,
      lowStockThreshold: 4,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: catPret.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: 'Pure Micro Velvet with Silk Organza Dupatta',
      careInstructions: 'Dry clean only. Store in a breathable cotton garment bag.',
      seoTitle: 'Crimson Velvet Embroidered Kurta | Artisha Lahore',
      seoDescription: 'Shop our signature crimson velvet luxury kurta set hand-embellished with heritage dabka and tilla embroidery at Artisha Dolmen Mall Lahore.',
      variants: [
        { sku: 'ART-VEL-001-S', name: 'Small / Crimson', size: 'Small', color: 'Crimson', stock: 6 },
        { sku: 'ART-VEL-001-M', name: 'Medium / Crimson', size: 'Medium', color: 'Crimson', stock: 8 },
        { sku: 'ART-VEL-001-L', name: 'Large / Crimson', size: 'Large', color: 'Crimson', stock: 4 },
      ],
    },
    {
      name: 'Ivory Hand-Block Chanderi Silk Angrakha',
      slug: 'ivory-hand-block-chanderi-silk-angrakha',
      sku: 'ART-CHN-002',
      description: 'A poetic ode to old Lahore craftsmanship. Features a flowing flared Chanderi silk silhouette with custom hand-carved floral block prints in muted beige and antique gold. Accented with handmade fabric tassels and pearl drops.',
      shortDescription: 'Flared Ivory Chanderi silk Angrakha with hand-blocked motifs and delicate pearl trims.',
      price: 19800,
      salePrice: null,
      costPrice: 9200,
      stock: 14,
      lowStockThreshold: 3,
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      categoryId: catPret.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '100% Chanderi Silk & Cotton Mulmul Lining',
      careInstructions: 'Gentle dry clean recommended. Cool iron on reverse.',
      seoTitle: 'Ivory Chanderi Silk Angrakha - Artisha Boutique',
      seoDescription: 'Discover the artisanal ivory Angrakha kurta in pure Chanderi silk. Available online and at Artisha Dolmen Mall Lahore.',
      variants: [
        { sku: 'ART-CHN-002-S', name: 'Small / Ivory', size: 'Small', color: 'Ivory', stock: 5 },
        { sku: 'ART-CHN-002-M', name: 'Medium / Ivory', size: 'Medium', color: 'Ivory', stock: 5 },
        { sku: 'ART-CHN-002-L', name: 'Large / Ivory', size: 'Large', color: 'Ivory', stock: 4 },
      ],
    },
    {
      name: 'Emerald Heritage Zardozi Bridal Peshwas',
      slug: 'emerald-heritage-zardozi-bridal-peshwas',
      sku: 'ART-PESH-003',
      description: 'A masterpiece from the Royal Artisha Atelier. Crafted on pure bottle green raw silk with 16 kalis, extensively hand-worked with French knots, gotta patti, kora, and semi-precious emerald bead inlays. Accompanied by a heavy mukesh net dupatta.',
      shortDescription: 'Royal emerald raw silk peshwas heavily hand-crafted with antique zardozi, crystals, and mukesh.',
      price: 78000,
      salePrice: 69900,
      costPrice: 38000,
      stock: 4,
      lowStockThreshold: 2,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: catFestive.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '80g Pure Raw Silk with Mukesh Net Dupatta',
      careInstructions: 'Strictly dry clean. Preserve in acid-free tissue wrap.',
      seoTitle: 'Emerald Green Zardozi Formal Peshwas | Artisha Lahore',
      seoDescription: 'Exclusive bridal & luxury festive wear by Artisha. Traditional hand-embellished craftsmanship.',
      variants: [
        { sku: 'ART-PESH-003-CUSTOM', name: 'Custom Stitched / Emerald', size: 'Custom', color: 'Emerald Green', stock: 4 },
      ],
    },
    {
      name: 'Champagne Tissue Gold Kalidar Set',
      slug: 'champagne-tissue-gold-kalidar-set',
      sku: 'ART-TIS-004',
      description: 'Shimmering metallic gold tissue fabric cut into a dramatic 24-kali flared silhouette. Embellished with delicate resham floral bouquets and badla wire embroidery. Paired with crushed silk Dhaka trousers.',
      shortDescription: 'Shimmering champagne tissue kalidar with antique badla embroidery and crushed silk trousers.',
      price: 52000,
      salePrice: null,
      costPrice: 26000,
      stock: 8,
      lowStockThreshold: 3,
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      categoryId: catFestive.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: 'Gold Metallic Silk Tissue with Silk Lining',
      careInstructions: 'Specialist dry clean only.',
      seoTitle: 'Champagne Tissue Gold Kalidar | Artisha Couture',
      seoDescription: 'Elegance redefined in molten gold tissue. Shop the new festive collection at Artisha.',
      variants: [
        { sku: 'ART-TIS-004-S', name: 'Small / Gold', size: 'Small', color: 'Champagne Gold', stock: 3 },
        { sku: 'ART-TIS-004-M', name: 'Medium / Gold', size: 'Medium', color: 'Champagne Gold', stock: 3 },
        { sku: 'ART-TIS-004-L', name: 'Large / Gold', size: 'Large', color: 'Champagne Gold', stock: 2 },
      ],
    },
    {
      name: 'Kashmiri Aari Embroidered Pure Pashmina Shawl',
      slug: 'kashmiri-aari-embroidered-pure-pashmina-shawl',
      sku: 'ART-SHWL-005',
      description: 'Spun from authentic Himalayan cashmere and hand-embroidered by master artisans in Kashmir. Features intricate all-over floral jaal work utilizing fine silk needlework that takes over 4 months to complete.',
      shortDescription: 'Heirloom 100% pure pashmina shawl with fine all-over hand needlework in antique burgundy tones.',
      price: 48500,
      salePrice: 42000,
      costPrice: 24000,
      stock: 6,
      lowStockThreshold: 2,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: catShawls.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '100% Grade-A Himalayan Cashmere Wool',
      careInstructions: 'Professional dry clean. Keep in cedar wood storage.',
      seoTitle: 'Pure Pashmina Hand-Embroidered Shawl | Artisha Pakistan',
      seoDescription: 'Authentic Kashmiri Pashmina hand-embroidered shawls. Timeless luxury at Artisha Lahore.',
      variants: [
        { sku: 'ART-SHWL-005-BURGUNDY', name: 'Standard / Deep Burgundy', size: 'Free Size', color: 'Burgundy', stock: 4 },
        { sku: 'ART-SHWL-005-IVORY', name: 'Standard / Antique Ivory', size: 'Free Size', color: 'Antique Ivory', stock: 2 },
      ],
    },
    {
      name: 'Handwoven Kalamkari Silk Wool Doshala',
      slug: 'handwoven-kalamkari-silk-wool-doshala',
      sku: 'ART-SHWL-006',
      description: 'Featuring freehand pen-drawn Kalamkari motifs depicting royal Mughal courtyards and flora, printed on a luxurious blend of merino wool and wild tussar silk. Finished with pure silk fringe borders.',
      shortDescription: 'Merino wool and silk blend reversible doshala with classical Mughal miniature motifs.',
      price: 28000,
      salePrice: null,
      costPrice: 14000,
      stock: 12,
      lowStockThreshold: 3,
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      categoryId: catShawls.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '60% Merino Wool, 40% Tussar Silk',
      careInstructions: 'Dry clean only.',
      seoTitle: 'Kalamkari Mughal Art Doshala Shawl - Artisha',
      seoDescription: 'Heritage silk-wool doshala with authentic Mughal art motifs. Premium luxury shawls at Artisha.',
      variants: [
        { sku: 'ART-SHWL-006-ONE', name: 'Free Size / Ochre & Navy', size: 'Free Size', color: 'Ochre Navy', stock: 12 },
      ],
    },
    {
      name: 'Maroon Velvet Dabka Handcrafted Potli Bag',
      slug: 'maroon-velvet-dabka-handcrafted-potli-bag',
      sku: 'ART-BAG-007',
      description: 'The quintessential wedding companion. Structured in lush micro-velvet with circular zardozi medallions, braided metallic drawstring cords, and ornate hanging pearl jhumkas.',
      shortDescription: 'Micro-velvet evening potli bag with zardozi medallion embroidery and pearl tassels.',
      price: 8500,
      salePrice: 7200,
      costPrice: 3500,
      stock: 22,
      lowStockThreshold: 5,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: catAccessories.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: 'Micro Velvet, Zari Embroidery, Cultured Pearl Accents',
      careInstructions: 'Wipe gently with dry cloth. Store in dust bag.',
      seoTitle: 'Embroidered Velvet Potli Bag | Artisha Accessories',
      seoDescription: 'Handcrafted luxury festive potli bags in Lahore. Available at Artisha Dolmen Mall.',
      variants: [
        { sku: 'ART-BAG-007-MAROON', name: 'Standard / Deep Maroon', size: 'One Size', color: 'Deep Maroon', stock: 14 },
        { sku: 'ART-BAG-007-EMERALD', name: 'Standard / Emerald', size: 'One Size', color: 'Emerald Green', stock: 8 },
      ],
    },
    {
      name: 'Artisanal Hand-Stitched Zari Leather Khussa',
      slug: 'artisanal-hand-stitched-zari-leather-khussa',
      sku: 'ART-KHS-008',
      description: 'Crafted from soft vegetable-tanned genuine leather with padded footbeds for all-day comfort. Intricately adorned with hand-stitched real silver zari thread and dabka knot work.',
      shortDescription: 'Soft genuine leather khussa with antique zari work and cushioned memory footbed.',
      price: 6800,
      salePrice: null,
      costPrice: 2800,
      stock: 25,
      lowStockThreshold: 5,
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      categoryId: catAccessories.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '100% Genuine Leather & Hand-Spun Zari Thread',
      careInstructions: 'Keep dry. Condition leather with natural beeswax balm.',
      seoTitle: 'Handcrafted Traditional Khussa Shoes - Artisha',
      seoDescription: 'Pure leather khussas hand-embroidered with tilla and zari. Shop Artisha footwear.',
      variants: [
        { sku: 'ART-KHS-008-37', name: 'Size 37 / Gold & Tan', size: '37', color: 'Gold Tan', stock: 8 },
        { sku: 'ART-KHS-008-38', name: 'Size 38 / Gold & Tan', size: '38', color: 'Gold Tan', stock: 9 },
        { sku: 'ART-KHS-008-39', name: 'Size 39 / Gold & Tan', size: '39', color: 'Gold Tan', stock: 8 },
      ],
    },
    {
      name: 'Royal Heritage Polki & Kundan Choker Set',
      slug: 'royal-heritage-polki-and-kundan-choker-set',
      sku: 'ART-JWL-009',
      description: 'Inspired by the regal jewelry of Mughal empresses. Crafted with 22k gold micro-plated brass, hand-set faceted polki glass stones, and strung with natural freshwater pearls and ruby-red drops.',
      shortDescription: '22k gold plated bridal kundan choker with matching jhumkas and freshwater pearl strings.',
      price: 34000,
      salePrice: 29500,
      costPrice: 15000,
      stock: 5,
      lowStockThreshold: 2,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: catJewelry.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '22K Gold Plated Brass, Polki Stones, Real Freshwater Pearls',
      careInstructions: 'Avoid direct perfume and moisture contact. Store in velvet jewelry case.',
      seoTitle: 'Polki Kundan Bridal Choker Set | Artisha Lahore',
      seoDescription: 'Bespoke heirloom jewellery set with kundan choker, matching earrings and tikka.',
      variants: [
        { sku: 'ART-JWL-009-GOLD', name: 'Complete Set / Antique Gold', size: 'Standard', color: 'Antique Gold', stock: 5 },
      ],
    },
    {
      name: 'Handcrafted Silver Filigree Floral Jhumkas',
      slug: 'handcrafted-silver-filigree-floral-jhumkas',
      sku: 'ART-JWL-010',
      description: 'Pure 925 sterling silver filigree jhumkas handcrafted in Taxila and Multan using ancestral wire-weaving techniques. Accented with tiny emerald stones and silver bell drops that chime softly.',
      shortDescription: '925 sterling silver filigree wire jhumkas with emerald accents and delicate silver bells.',
      price: 16500,
      salePrice: null,
      costPrice: 8000,
      stock: 10,
      lowStockThreshold: 3,
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      categoryId: catJewelry.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '925 Sterling Silver with Semi-Precious Inlay',
      careInstructions: 'Clean with silver polishing cloth. Keep in airtight zip bag.',
      seoTitle: '925 Silver Filigree Traditional Jhumkas - Artisha',
      seoDescription: 'Artisanal sterling silver traditional earrings with heritage filigree craftsmanship.',
      variants: [
        { sku: 'ART-JWL-010-SILVER', name: 'Pair / Oxidized Silver', size: 'Standard', color: 'Oxidized Silver', stock: 10 },
      ],
    },
    {
      name: 'Hand-Carved Walnut Wood Brass Inlay Keepsake Box',
      slug: 'hand-carved-walnut-wood-brass-inlay-keepsake-box',
      sku: 'ART-HOM-011',
      description: 'Sculpted from seasoned Kashmiri walnut wood with intricate hand-cut floral brass wire inlays. Lined inside with rich crimson velvet. An enduring piece of Pakistani craft heritage for your dresser or study.',
      shortDescription: 'Solid walnut wood jewelry box with delicate brass wire floral inlay and velvet interior.',
      price: 12500,
      salePrice: 10800,
      costPrice: 5500,
      stock: 15,
      lowStockThreshold: 4,
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      categoryId: catHome.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: 'Seasoned Kashmiri Walnut Wood & Pure Solid Brass',
      careInstructions: 'Wipe with soft microfiber cloth. Nourish with walnut oil annually.',
      seoTitle: 'Walnut Wood & Brass Inlay Box | Artisha Home Living',
      seoDescription: 'Luxury handcrafted wooden keepsake and jewelry boxes by Artisha Lahore.',
      variants: [
        { sku: 'ART-HOM-011-BOX', name: 'Medium (8x6 in) / Natural Walnut', size: '8x6 inches', color: 'Natural Walnut', stock: 15 },
      ],
    },
    {
      name: 'Botanical Hand-Block Printed Cotton Sateen Bedspread',
      slug: 'botanical-hand-block-printed-cotton-sateen-bedspread',
      sku: 'ART-HOM-012',
      description: 'Crafted from 400-thread-count long-staple cotton sateen, individually stamped using teakwood blocks carved with indigenous jasmine and pomegranate motifs in earthy terracotta and sage hues.',
      shortDescription: 'King-size 400TC cotton sateen bedspread with hand-blocked botanical art and 2 pillow shams.',
      price: 18500,
      salePrice: null,
      costPrice: 8500,
      stock: 12,
      lowStockThreshold: 3,
      isFeatured: false,
      isBestseller: false,
      isNewArrival: false,
      categoryId: catHome.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
      ]),
      material: '400 Thread Count Pure Cotton Sateen',
      careInstructions: 'Machine wash delicate cycle in cold water. Tumble dry low.',
      seoTitle: 'Hand-Block Printed Luxury Bedspread - Artisha',
      seoDescription: 'Premium cotton sateen artisanal bedspreads and home textiles at Artisha.',
      variants: [
        { sku: 'ART-HOM-012-KING', name: 'King Size / Terracotta Sage', size: 'King', color: 'Terracotta Sage', stock: 12 },
      ],
    },
  ];

  for (const item of productsData) {
    const { variants, ...prod } = item;
    const createdProduct = await prisma.product.create({
      data: {
        ...prod,
        variants: {
          create: variants,
        },
      },
    });

    // Record initial stock movement
    await prisma.stockMovement.create({
      data: {
        productId: createdProduct.id,
        type: 'RESTOCK',
        quantity: createdProduct.stock,
        reason: 'Initial boutique atelier stock intake',
        referenceNote: `Batch ART-2026-Q1`,
        userId: superAdmin.id,
      },
    });
  }

  // 6. Reviews
  const allProds = await prisma.product.findMany();
  const sampleReviews = [
    {
      productIndex: 0,
      authorName: 'Aamna Sohail (DHA Lahore)',
      rating: 5,
      comment: 'The crimson velvet kurta exceeded all expectations! The dabka embroidery has remarkable depth and precision. I wore it for a family dholki and received endless compliments.',
      isVerifiedPurchase: true,
    },
    {
      productIndex: 0,
      authorName: 'Mahnoor Tariq',
      rating: 5,
      comment: 'Super fast delivery in Lahore (arrived next day!). The packaging in velvet garment bags feels ultra luxurious. Truly a boutique experience.',
      isVerifiedPurchase: true,
    },
    {
      productIndex: 2,
      authorName: 'Dr. Sarah Farooq (Islamabad)',
      rating: 5,
      comment: 'The bridal peshwas is a true heirloom piece. The craftsmanship is identical to high-end bridal couture at three times the price. Stunning!',
      isVerifiedPurchase: true,
    },
    {
      productIndex: 4,
      authorName: 'Nida Khawaja (Karachi)',
      rating: 5,
      comment: 'Genuine cashmere pashmina with breathtaking needlework. Incredibly soft, featherlight yet wonderfully warm. Highly recommended.',
      isVerifiedPurchase: true,
    },
    {
      productIndex: 6,
      authorName: 'Hira Usman',
      rating: 5,
      comment: 'The maroon potli bag is even prettier in person! Sturdy structure and lovely pearls.',
      isVerifiedPurchase: true,
    },
  ];

  for (const rev of sampleReviews) {
    if (allProds[rev.productIndex]) {
      await prisma.review.create({
        data: {
          productId: allProds[rev.productIndex].id,
          authorName: rev.authorName,
          rating: rev.rating,
          comment: rev.comment,
          isVerifiedPurchase: rev.isVerifiedPurchase,
          status: 'APPROVED',
        },
      });
    }
  }

  // 7. Orders & Payments
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ART-10021',
      userId: customerUser.id,
      shippingAddress: 'House 42, Sector Y, Phase 3, DHA, Lahore',
      city: 'Lahore',
      postalCode: '54792',
      shippingMethod: 'STANDARD',
      shippingCost: 150,
      paymentMethod: 'COD',
      paymentStatus: 'VERIFIED',
      orderStatus: 'DELIVERED',
      subtotal: 24500,
      discountAmount: 2450,
      couponCode: 'ARTISHA10',
      totalAmount: 22200,
      trackingNumber: 'TCS-98320194',
      courierName: 'TCS Express',
      customerNotes: 'Please ring the bell upon arrival.',
      internalNotes: 'Delivered smoothly by TCS on 18 Nov.',
      items: {
        create: [
          {
            productId: allProds[0].id,
            name: allProds[0].name,
            sku: allProds[0].sku,
            price: 24500,
            quantity: 1,
            subtotal: 24500,
            imageUrl: JSON.parse(allProds[0].images)[0],
          },
        ],
      },
      payments: {
        create: {
          amount: 22200,
          paymentMethod: 'COD',
          status: 'VERIFIED',
          transactionRef: 'COD-LHR-9832',
          notes: 'Cash collected by TCS rider and remitted.',
          verifiedAt: new Date(),
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ART-10022',
      guestName: 'Mariam Jahangir',
      guestEmail: 'mariam.j@gmail.com',
      guestPhone: '+92 321 8844221',
      shippingAddress: 'Apartment 4B, Creek Vistas, Phase 8, DHA, Karachi',
      city: 'Karachi',
      postalCode: '75500',
      shippingMethod: 'STANDARD',
      shippingCost: 250,
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'VERIFIED',
      orderStatus: 'SHIPPED',
      subtotal: 48500,
      discountAmount: 1000,
      couponCode: 'WELCOME1000',
      totalAmount: 47750,
      trackingNumber: 'LEO-78491023',
      courierName: 'Leopards Courier',
      customerNotes: 'Deliver between 10am to 5pm.',
      internalNotes: 'Bank receipt verified with Meezan Bank Ltd account.',
      items: {
        create: [
          {
            productId: allProds[4].id,
            name: allProds[4].name,
            sku: allProds[4].sku,
            price: 48500,
            quantity: 1,
            subtotal: 48500,
            imageUrl: JSON.parse(allProds[4].images)[0],
          },
        ],
      },
      payments: {
        create: {
          amount: 47750,
          paymentMethod: 'BANK_TRANSFER',
          status: 'VERIFIED',
          transactionRef: 'MEZN-TRX-839210',
          bankAccount: 'Meezan Bank - Artisha Private Limited',
          notes: 'Customer transferred via mobile app. Receipt matched.',
          verifiedAt: new Date(),
        },
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ART-10023',
      guestName: 'Alizeh Chaudhry',
      guestEmail: 'alizeh.c@hotmail.com',
      guestPhone: '+92 333 4455889',
      shippingAddress: 'Street 12, F-7/2, Islamabad',
      city: 'Islamabad',
      postalCode: '44000',
      shippingMethod: 'STANDARD',
      shippingCost: 250,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PROCESSING',
      subtotal: 28300,
      discountAmount: 0,
      couponCode: null,
      totalAmount: 28550,
      customerNotes: 'Gift wrapping requested please.',
      internalNotes: 'Order confirmed with customer via call. Packing in boutique luxury gift box.',
      items: {
        create: [
          {
            productId: allProds[1].id,
            name: allProds[1].name,
            sku: allProds[1].sku,
            price: 19800,
            quantity: 1,
            subtotal: 19800,
            imageUrl: JSON.parse(allProds[1].images)[0],
          },
          {
            productId: allProds[6].id,
            name: allProds[6].name,
            sku: allProds[6].sku,
            price: 8500,
            quantity: 1,
            subtotal: 8500,
            imageUrl: JSON.parse(allProds[6].images)[0],
          },
        ],
      },
      payments: {
        create: {
          amount: 28550,
          paymentMethod: 'COD',
          status: 'PENDING',
          notes: 'Pending delivery collection',
        },
      },
    },
  });

  // 8. Business Expenses
  await prisma.expense.createMany({
    data: [
      {
        title: 'Boutique Retail Lease - Dolmen Mall Lahore',
        category: 'RENT',
        amount: 350000,
        date: new Date('2026-11-01'),
        description: 'Monthly store rental for Artisha flagship boutique at Dolmen Mall Lahore.',
        recordedBy: 'Syeda Fatima (CEO)',
      },
      {
        title: 'Staff Salaries (Atelier Artisans & Sales Associates)',
        category: 'SALARIES',
        amount: 240000,
        date: new Date('2026-11-05'),
        description: 'Payroll for 6 boutique associates, master pattern cutters, and embroiderers.',
        recordedBy: 'Hamza Malik (Operations)',
      },
      {
        title: 'Raw Silk & Cashmere Fabric Procurement',
        category: 'INVENTORY',
        amount: 420000,
        date: new Date('2026-11-08'),
        description: 'Winter festive fabric intake: 200m raw silk and 50 cashmere pashmina blankets.',
        recordedBy: 'Ayesha Tariq',
      },
      {
        title: 'Instagram & Meta Editorial Ads Campaign',
        category: 'MARKETING',
        amount: 65000,
        date: new Date('2026-11-12'),
        description: 'High-intent digital awareness campaign targeting Lahore, Karachi, and Islamabad.',
        recordedBy: 'Hamza Malik',
      },
      {
        title: 'Custom Velvet Garment Bags & Magnetic Hardboxes',
        category: 'PACKAGING',
        amount: 45000,
        date: new Date('2026-11-14'),
        description: '500 embossed gold foil magnetic luxury gift boxes and 300 velvet dustbags.',
        recordedBy: 'Hamza Malik',
      },
      {
        title: 'TCS & Leopards Courier Account Logistics Invoice',
        category: 'COURIER',
        amount: 28500,
        date: new Date('2026-11-16'),
        description: 'Bi-weekly courier freight settlement for nationwide orders.',
        recordedBy: 'Bilal Khan',
      },
    ],
  });

  // 9. Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: 'STOCK_LOW',
        title: 'Low Stock Alert',
        message: 'Emerald Heritage Zardozi Bridal Peshwas (ART-PESH-003) has only 4 units remaining.',
        link: '/admin/inventory',
        isRead: false,
      },
      {
        type: 'ORDER_NEW',
        title: 'New Order Received',
        message: 'Order #ART-10023 received from Alizeh Chaudhry for Rs. 28,550 (Islamabad).',
        link: '/admin/orders',
        isRead: false,
      },
      {
        type: 'CUSTOMER_NEW',
        title: 'New VIP Customer Registration',
        message: 'Zainab Qureshi registered an account with shipping address in DHA Lahore.',
        link: '/admin/customers',
        isRead: true,
      },
    ],
  });

  // 10. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: superAdmin.id,
        userName: superAdmin.name,
        userRole: superAdmin.role,
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'Order',
        entityId: order1.id,
        details: 'Order ART-10021 marked as DELIVERED after confirmation from TCS Express.',
      },
      {
        userId: manager.id,
        userName: manager.name,
        userRole: manager.role,
        action: 'VERIFY_PAYMENT',
        entityType: 'PaymentTransaction',
        entityId: order2.id,
        details: 'Bank transfer receipt MEZN-TRX-839210 verified and approved.',
      },
      {
        userId: inventoryManager.id,
        userName: inventoryManager.name,
        userRole: inventoryManager.role,
        action: 'STOCK_ADJUSTMENT',
        entityType: 'Product',
        entityId: allProds[0].id,
        details: 'Stock verified for Crimson Velvet Kurta Set across Small, Medium, and Large.',
      },
    ],
  });

  // 11. Website Content Configurations
  const websiteContent = {
    announcement: {
      text: 'Visit our flagship boutique at Dolmen Mall Lahore | Enjoy complimentary nationwide delivery on orders over Rs. 10,000',
      isActive: true,
      link: '/shop',
    },
    hero: {
      tagline: 'AUTUMN / WINTER 2026 LUXURY ATELIER',
      headline: 'The Poetry of Pakistani Craftsmanship',
      subheadline: 'Artisanal couture, handwoven pashminas, and timeless heirlooms designed for the discerning modern connoisseur.',
      primaryButtonText: 'Explore Collection',
      primaryButtonLink: '/shop',
      secondaryButtonText: 'Visit Dolmen Mall Boutique',
      secondaryButtonLink: '/contact',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1800',
    },
    storeInfo: {
      brandName: 'Artisha',
      tagline: 'Curated Pret, Luxury Festive & Artisanal Heirlooms',
      address: 'Shop 104, First Floor, Dolmen Mall, Sector T, DHA Phase 6, Lahore, Pakistan',
      phone: '+92 300 8472910',
      whatsapp: '+92 300 8472910',
      email: 'concierge@artisha.pk',
      supportEmail: 'care@artisha.pk',
      timings: 'Monday – Sunday: 11:00 AM – 11:00 PM',
      googleMapsEmbedUrl: 'https://maps.google.com/?q=Dolmen+Mall+Lahore',
    },
    socialLinks: {
      instagram: 'https://instagram.com/artisha.official',
      facebook: 'https://facebook.com/artishapakistan',
      pinterest: 'https://pinterest.com/artishapk',
      whatsapp: 'https://wa.me/923008472910',
    },
  };

  for (const [key, value] of Object.entries(websiteContent)) {
    await prisma.websiteContent.create({
      data: {
        key,
        value: JSON.stringify(value),
      },
    });
  }

  // 12. Newsletter Subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'sarah.malik@outlook.com' },
      { email: 'anaya.khurram@gmail.com' },
      { email: 'iman.hashmi@yahoo.com' },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
