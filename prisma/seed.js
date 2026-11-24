const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Artisha database for Jewellery, Accessories & Handmade Gifts...');

  // Clean existing data in referential integrity order
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
      name: 'Syeda Fatima (CEO & Creative Director)',
      email: 'admin@artisha.pk',
      passwordHash: adminPass,
      role: 'SUPER_ADMIN',
      phone: '+92 300 8472910',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Hamza Malik (Boutique & Operations Manager)',
      email: 'manager@artisha.pk',
      passwordHash: managerPass,
      role: 'MANAGER',
      phone: '+92 321 4455667',
    },
  });

  const inventoryManager = await prisma.user.create({
    data: {
      name: 'Ayesha Tariq (Jewellery & Stock Lead)',
      email: 'inventory@artisha.pk',
      passwordHash: staffPass,
      role: 'INVENTORY_MANAGER',
      phone: '+92 333 1122334',
    },
  });

  const orderManager = await prisma.user.create({
    data: {
      name: 'Bilal Khan (Gifting & Fulfillment Lead)',
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
        code: 'JEWEL15',
        discountType: 'PERCENTAGE',
        value: 15,
        minSpend: 12000,
        maxDiscount: 4000,
        usageLimit: 50,
        usedCount: 8,
        isActive: true,
      },
    ],
  });

  // 4. Categories - Focused strictly on Jewellery, Accessories, and Handmade Gifts
  const catJewellery = await prisma.category.create({
    data: {
      name: 'Handcrafted Jewellery',
      slug: 'jewellery',
      description: 'Heirloom Polki chokers, Kundan chandbalis, 925 sterling silver filigree, and semi-precious stone adornments.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 1,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Bespoke Accessories',
      slug: 'accessories',
      description: 'Embroidered velvet potlis, zardozi clutches, minaudières, hair jewellery, and silk scarves.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 2,
    },
  });

  const catHandmadeGifts = await prisma.category.create({
    data: {
      name: 'Handmade Gifts & Keepsakes',
      slug: 'handmade-gifts',
      description: 'Artisanal soy candles in antique brass, marble inlay vanity trays, and hand-carved sheesham keepsake boxes.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 3,
    },
  });

  const catGiftHampers = await prisma.category.create({
    data: {
      name: 'Luxury Gift Hampers',
      slug: 'gift-hampers',
      description: 'Curated celebration and bridal gift boxes pairing handcrafted jewelry, artisanal potlis, and scented keepsakes.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
      featured: true,
      displayOrder: 4,
    },
  });

  // 5. Products (12 Luxury Pieces strictly in Jewellery, Accessories, and Handmade Gifts)
  const productsData = [
    // --- JEWELLERY ---
    {
      name: 'Royal Polki & Pearl Choker Set with Jhumkas',
      slug: 'royal-polki-pearl-choker-set',
      sku: 'ART-JWL-001',
      description: 'A regal statement choker handcrafted with uncut polki stones set in 22k antique gold plating, accented by natural baroque freshwater pearl drops and rich emerald green meenakari on the reverse. Includes a matching pair of cascading polki jhumkas and adjustable silk dori string.',
      shortDescription: 'Regal polki choker with freshwater pearl droplets and matching cascading jhumkas.',
      price: 18500,
      salePrice: 16990,
      costPrice: 8500,
      stock: 12,
      lowStockThreshold: 3,
      categoryId: catJewellery.id,
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1611591475878-8f83038a8e31?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      material: '22K Gold Plated Brass, Uncut Polki, Cultured Pearls, Meenakari Enamel',
      careInstructions: 'Avoid direct contact with perfumes, moisture, and alcohol sprays. Store in airtight luxury suede pouch provided.',
      seoTitle: 'Royal Polki & Pearl Choker Set | Artisha Lahore',
      seoDescription: 'Handcrafted Polki choker set with baroque pearl droplets and matching jhumkas at Artisha Dolmen Mall Lahore.',
      variants: [
        { name: 'Emerald Green Drops', sku: 'ART-JWL-001-EM', price: 18500, stock: 6, color: 'Emerald Green', material: '22K Gold Plated' },
        { name: 'Ruby Red Drops', sku: 'ART-JWL-001-RB', price: 18500, stock: 6, color: 'Ruby Red', material: '22K Gold Plated' },
      ],
    },
    {
      name: 'Antique Gold-Plated Kundan Chandbali Earrings',
      slug: 'antique-kundan-chandbali-earrings',
      sku: 'ART-JWL-002',
      description: 'Classic crescent chandbalis crafted with glass Kundan stones, delicate seed pearl fringe, and fine micro-filigree detailing. Lightweight yet opulent, designed for festive celebrations and wedding soirées.',
      shortDescription: 'Classic crescent Kundan chandbalis with seed pearl fringe and antique gold finish.',
      price: 9800,
      salePrice: null,
      costPrice: 4200,
      stock: 18,
      lowStockThreshold: 4,
      categoryId: catJewellery.id,
      images: [
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      material: 'Gold Plated Brass, Kundan Stones, Seed Pearls',
      careInstructions: 'Wipe with soft lint-free cloth after each wear. Keep dry.',
      seoTitle: 'Antique Kundan Chandbali Earrings | Artisha Lahore',
      seoDescription: 'Handcrafted Kundan chandbalis with delicate seed pearl fringe. Available at Artisha Lahore boutique.',
      variants: [
        { name: 'Standard Pair', sku: 'ART-JWL-002-STD', price: 9800, stock: 18, color: 'Antique Gold', material: 'Kundan & Pearls' },
      ],
    },
    {
      name: 'Handcrafted 925 Sterling Silver Filigree Cuff Bracelet',
      slug: 'sterling-silver-filigree-cuff',
      sku: 'ART-JWL-003',
      description: 'Handcrafted in genuine 925 sterling silver by multigenerational silversmiths, this cuff exhibits the time-honored art of fine wire filigree. Features an adjustable open silhouette with oxidised antique patina highlights.',
      shortDescription: 'Handcrafted 925 sterling silver cuff with intricate floral wire filigree and antique patina.',
      price: 14200,
      salePrice: 12900,
      costPrice: 6500,
      stock: 10,
      lowStockThreshold: 2,
      categoryId: catJewellery.id,
      images: [
        'https://images.unsplash.com/photo-1611591475878-8f83038a8e31?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      material: 'Solid 925 Sterling Silver (Hallmarked)',
      careInstructions: 'Store in airtight pouch to prevent natural oxidation. Polish gently with a silver polishing cloth.',
      seoTitle: '925 Sterling Silver Filigree Cuff | Artisha Jewellery',
      seoDescription: 'Authentic 925 sterling silver filigree cuff handcrafted in Pakistan. Visit Artisha at Dolmen Mall Lahore.',
      variants: [
        { name: 'Adjustable Medium (6.5 - 7.5 inch)', sku: 'ART-JWL-003-M', price: 14200, stock: 10, size: 'Medium Adjustable', color: 'Oxidized Silver' },
      ],
    },
    {
      name: 'Emerald Green Meenakari & Pearl Statement Ring',
      slug: 'emerald-meenakari-pearl-statement-ring',
      sku: 'ART-JWL-004',
      description: 'An oversized royal cocktail ring featuring a deep emerald green glass stone framed with delicate Kundan petals and cultured pearl clusters. The shank is fully adjustable and adorned with traditional blue and ivory meenakari enamel.',
      shortDescription: 'Oversized royal cocktail ring with Kundan petals, pearl clusters, and meenakari enamel.',
      price: 6400,
      salePrice: null,
      costPrice: 2800,
      stock: 15,
      lowStockThreshold: 3,
      categoryId: catJewellery.id,
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      material: '22K Gold Plated Alloy, Meenakari Enamel, Faux Emerald, Pearls',
      careInstructions: 'Protect from liquid immersion and moisture.',
      seoTitle: 'Emerald Meenakari Statement Ring | Artisha Jewellery',
      seoDescription: 'Oversized royal cocktail ring with Kundan petals and meenakari artwork at Artisha Lahore.',
      variants: [
        { name: 'Free Size Adjustable', sku: 'ART-JWL-004-FS', price: 6400, stock: 15, size: 'Adjustable', color: 'Emerald Green' },
      ],
    },
    {
      name: 'Traditional Zircon & Ruby Bridal Matha Patti',
      slug: 'traditional-zircon-ruby-bridal-matha-patti',
      sku: 'ART-JWL-005',
      description: 'A majestic headpiece fit for a regal bride. Hand-set with sparkling cubic zirconia, rich ruby-tinted stones, and delicate pearl stringing that rests effortlessly along the hairline.',
      shortDescription: 'Majestic bridal headpiece with cubic zirconia, ruby crystals, and seed pearl borders.',
      price: 12900,
      salePrice: null,
      costPrice: 5600,
      stock: 7,
      lowStockThreshold: 2,
      categoryId: catJewellery.id,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      material: 'Antique Gold Finish, Cubic Zirconia, Crystal Rubies, Seed Pearls',
      careInstructions: 'Store flat in padded box.',
      seoTitle: 'Zircon & Ruby Bridal Matha Patti | Artisha Lahore',
      seoDescription: 'Handcrafted bridal matha patti headpiece with ruby crystals and seed pearls.',
      variants: [
        { name: 'Standard Single Headband', sku: 'ART-JWL-005-STD', price: 12900, stock: 7, color: 'Ruby & Antique Gold', material: 'Brass & Pearls' },
      ],
    },

    // --- ACCESSORIES ---
    {
      name: 'Embroidered Crimson Micro-Velvet Potli Bag with Pearl Tassels',
      slug: 'crimson-velvet-embroidered-potli-bag',
      sku: 'ART-ACC-001',
      description: 'Crafted in plush micro-velvet dyed in Artisha signature deep burgundy crimson. Decorated with antique zardozi dabka hand embroidery, golden tilla work, and finished with heavy clusters of baroque pearl tassels and braided drawstring cords.',
      shortDescription: 'Plush crimson micro-velvet potli with handcrafted zardozi embroidery and pearl tassels.',
      price: 7500,
      salePrice: 6800,
      costPrice: 3100,
      stock: 22,
      lowStockThreshold: 5,
      categoryId: catAccessories.id,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      material: 'Silk Micro-Velvet, Gold Zardozi Dabka, Pearl Drops, Satin Lining',
      careInstructions: 'Spot clean only. Store with silica gel pack.',
      seoTitle: 'Crimson Velvet Zardozi Potli Bag | Artisha Accessories',
      seoDescription: 'Hand-embroidered burgundy velvet potli bag with pearl tassels at Artisha Dolmen Mall Lahore.',
      variants: [
        { name: 'Burgundy Crimson', sku: 'ART-ACC-001-BUR', price: 7500, stock: 12, color: 'Burgundy Crimson', material: 'Micro-Velvet' },
        { name: 'Emerald Green', sku: 'ART-ACC-001-EMG', price: 7500, stock: 10, color: 'Emerald Green', material: 'Micro-Velvet' },
      ],
    },
    {
      name: 'Hand-Zardozi Raw Silk Evening Clutch with Antique Clasp',
      slug: 'hand-zardozi-raw-silk-evening-clutch',
      sku: 'ART-ACC-002',
      description: 'An elegant hard-case minaudière clutch wrapped in pure raw silk. Hand-embroidered with floral marori motifs, sequins, and metallic tilla. Features an antique brass push clasp embedded with a faceted onyx stone and detachable brass chain strap.',
      shortDescription: 'Raw silk hard-case clutch with floral marori embroidery, onyx clasp, and detachable chain.',
      price: 11200,
      salePrice: 9990,
      costPrice: 4800,
      stock: 14,
      lowStockThreshold: 3,
      categoryId: catAccessories.id,
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      material: 'Pure Raw Silk, Metal Hard Case, Hand Zardozi, Brass Chain',
      careInstructions: 'Avoid liquid spills. Keep in velvet dustbag.',
      seoTitle: 'Hand-Zardozi Raw Silk Evening Clutch | Artisha',
      seoDescription: 'Artisanal silk minaudière clutch with hand embroidery and antique brass chain.',
      variants: [
        { name: 'Ivory Gold', sku: 'ART-ACC-002-IVR', price: 11200, stock: 8, color: 'Ivory Gold', material: 'Raw Silk' },
        { name: 'Midnight Black', sku: 'ART-ACC-002-BLK', price: 11200, stock: 6, color: 'Midnight Black', material: 'Raw Silk' },
      ],
    },
    {
      name: 'Artisanal Gota & Pearl Floral Hair Barrette Set',
      slug: 'artisanal-gota-pearl-hair-barrettes',
      sku: 'ART-ACC-003',
      description: 'A charming set of two artisanal hair pins sculpted with gold gota patti rosettes, freshwater pearl vines, and brass leaf filigree. Perfect for styling festive braids, chignons, and wedding guest updos.',
      shortDescription: 'Pair of handcrafted hair pins with gold gota rosettes and freshwater pearl vines.',
      price: 4200,
      salePrice: null,
      costPrice: 1600,
      stock: 25,
      lowStockThreshold: 5,
      categoryId: catAccessories.id,
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      material: 'Gold Gota Patti, Freshwater Pearls, Brass Clips',
      careInstructions: 'Gently wipe with dry cloth. Store in box.',
      seoTitle: 'Artisanal Gota & Pearl Hair Barrettes | Artisha',
      seoDescription: 'Handcrafted floral hair barrettes for festive styling at Artisha Dolmen Mall Lahore.',
      variants: [
        { name: 'Set of 2 Pins', sku: 'ART-ACC-003-PAIR', price: 4200, stock: 25, color: 'Antique Gold', material: 'Gota & Pearls' },
      ],
    },

    // --- HANDMADE GIFTS & KEEPSAKES ---
    {
      name: 'Hand-Carved Sheesham Wood Velvet-Lined Keepsake Box',
      slug: 'hand-carved-sheesham-keepsake-box',
      sku: 'ART-GFT-001',
      description: 'Hand-chiseled from sustainably harvested sheesham rosewood by master artisans in Chiniot, Pakistan. Features intricate lattice jali fretwork on the lid, brass corner brackets, and a plush midnight navy velvet interior with ring slots and keepsake compartments.',
      shortDescription: 'Chinioti hand-carved sheesham rosewood jewellery box with brass accents and velvet interior.',
      price: 8900,
      salePrice: 7990,
      costPrice: 3800,
      stock: 16,
      lowStockThreshold: 4,
      categoryId: catHandmadeGifts.id,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      material: 'Solid Sheesham Rosewood, Solid Brass Hardware, Velvet Lining',
      careInstructions: 'Clean with natural beeswax wood polish. Do not expose to direct prolonged sunlight.',
      seoTitle: 'Hand-Carved Sheesham Keepsake Jewellery Box | Artisha',
      seoDescription: 'Authentic Chinioti hand-carved sheesham keepsake box with brass accents at Artisha Lahore.',
      variants: [
        { name: 'Medium (8x6x4 inches)', sku: 'ART-GFT-001-M', price: 8900, stock: 16, size: '8x6x4 in', color: 'Natural Rosewood', material: 'Sheesham Wood' },
      ],
    },
    {
      name: 'Lapis Lazuli & Brass Inlay Marble Vanity Tray',
      slug: 'lapis-lazuli-brass-marble-vanity-tray',
      sku: 'ART-GFT-002',
      description: 'An heirloom decorative tray carved from solid Makrana white marble. Features hand-cut genuine Afghan lapis lazuli stone floral inlay paired with pure brass wire detailing. Designed as an opulent dresser vanity tray for perfumes, rings, and watches.',
      shortDescription: 'Solid white marble vanity tray with handcrafted lapis lazuli floral inlay and brass borders.',
      price: 13500,
      salePrice: null,
      costPrice: 6200,
      stock: 8,
      lowStockThreshold: 2,
      categoryId: catHandmadeGifts.id,
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      material: 'Natural White Marble, Semi-Precious Lapis Lazuli, Pure Brass Wire',
      careInstructions: 'Wipe with damp cloth. Avoid harsh acidic cleaners.',
      seoTitle: 'Lapis Lazuli & Brass Marble Vanity Tray | Artisha Gifts',
      seoDescription: 'Solid white marble tray with genuine lapis lazuli stone inlay at Artisha Dolmen Mall Lahore.',
      variants: [
        { name: 'Oblong 10x6 inch', sku: 'ART-GFT-002-10', price: 13500, stock: 8, size: '10x6 in', color: 'White & Cobalt Blue', material: 'Marble & Lapis' },
      ],
    },
    {
      name: 'Oudh & Rose Damascena Artisanal Soy Candle in Hammered Brass Vessel',
      slug: 'oudh-rose-damascena-brass-candle',
      sku: 'ART-GFT-003',
      description: 'Hand-poured 100% natural soy wax candle scented with precious botanical oils of pure Taif Rose Damascena, smoky Cambodian Oudh, and amber wood. Poured into a hand-hammered antique brass vessel made by traditional copper artisans in Lahore Old City. 55 hours burn time.',
      shortDescription: 'Hand-poured soy candle with Taif rose and smoky oudh in an artisan hammered brass vessel.',
      price: 5200,
      salePrice: null,
      costPrice: 2100,
      stock: 30,
      lowStockThreshold: 6,
      categoryId: catHandmadeGifts.id,
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: false,
      isBestseller: true,
      isNewArrival: true,
      material: '100% Soy Wax, Cotton Wick, Pure Fragrance Oils, Hand-Hammered Brass Jar',
      careInstructions: 'Trim wick to 1/4 inch before each lighting. Never leave burning candle unattended.',
      seoTitle: 'Oudh & Rose Damascena Hammered Brass Candle | Artisha Gifts',
      seoDescription: 'Artisanal hand-poured soy candle in an authentic hammered brass jar. Available at Artisha Lahore.',
      variants: [
        { name: '300g Brass Jar (55h burn)', sku: 'ART-GFT-003-300', price: 5200, stock: 30, size: '300g', color: 'Hammered Brass', material: 'Soy Wax & Brass' },
      ],
    },

    // --- LUXURY GIFT HAMPERS ---
    {
      name: 'The Imperial Celebration Hamper (Jewellery, Potli & Scented Keepsake)',
      slug: 'imperial-celebration-gift-hamper',
      sku: 'ART-HMP-001',
      description: 'The definitive luxury gift box for celebratory milestones. Presented in an embossed velvet keepsake crate tied with silk ribbon. Includes: 1 pair of Kundan Chandbali Earrings, 1 Hand-Embroidered Velvet Potli Bag, 1 Oudh & Rose Hand-Hammered Brass Candle, and an artisan greeting card with personalized calligraphy.',
      shortDescription: 'Curated luxury velvet hamper crate with Kundan earrings, velvet potli, and hammered brass candle.',
      price: 26000,
      salePrice: 23500,
      costPrice: 11000,
      stock: 9,
      lowStockThreshold: 2,
      categoryId: catGiftHampers.id,
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
      ],
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      material: 'Velvet Box, Kundan Brass Jewelry, Micro-Velvet Potli, Soy Wax Candle',
      careInstructions: 'Keep in cool dry location. Personalized card written upon order.',
      seoTitle: 'The Imperial Celebration Hamper | Artisha Luxury Gifts',
      seoDescription: 'Bespoke gift hamper pairing jewellery, hand-embroidered potli, and hammered brass candle at Artisha Lahore.',
      variants: [
        { name: 'Burgundy Imperial Crate', sku: 'ART-HMP-001-BUR', price: 26000, stock: 9, color: 'Burgundy & Gold', material: 'Velvet Hamper Box' },
      ],
    },
  ];

  // Insert products with variants and stock movements
  const createdProducts = [];
  for (const p of productsData) {
    const { variants, ...prodData } = p;
    const product = await prisma.product.create({
      data: {
        ...prodData,
        images: JSON.stringify(prodData.images),
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            size: v.size || null,
            color: v.color || null,
            material: v.material || null,
          })),
        },
      },
      include: { variants: true },
    });

    // Record initial stock movement
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        quantity: product.stock,
        type: 'RESTOCK',
        reason: 'Initial inventory intake for boutique opening & online storefront.',
        referenceNote: 'INITIAL_STOCK_IN',
        userId: superAdmin.id,
      },
    });

    createdProducts.push(product);
  }

  // 6. Verified Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: createdProducts[0].id, // Royal Polki Choker
        authorName: 'Mahnoor Tariq',
        rating: 5,
        comment: 'Breathtaking craftsmanship and heirloom quality. I purchased this choker set for my sister’s wedding at Dolmen Mall Lahore. The polki work is exquisite and the emerald meenakari on the reverse is such an authentic heirloom touch. Exceeded all expectations!',
        isVerifiedPurchase: true,
        status: 'APPROVED',
      },
      {
        productId: createdProducts[5].id, // Crimson Velvet Potli
        authorName: 'Ayesha Raza',
        rating: 5,
        comment: 'The velvet and zardozi work are unmatched. The burgundy micro-velvet is so rich and the pearl tassels give it the most luxurious drape. Carried it to a reception and received endless compliments.',
        isVerifiedPurchase: true,
        status: 'APPROVED',
      },
      {
        productId: createdProducts[8].id, // Sheesham Keepsake Box
        authorName: 'Farhan Siddiqui',
        rating: 5,
        comment: 'A true work of artisanal art. Bought this as an anniversary gift. The hand-carved jali fretwork on the rosewood and the velvet lining are impeccable. Proud of Pakistani artisan talent!',
        isVerifiedPurchase: true,
        status: 'APPROVED',
      },
    ],
  });

  // 7. Seed Orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ART-2026-1001',
      userId: customerUser.id,
      shippingAddress: 'House 42, Sector Y, Phase 3, DHA, Lahore',
      city: 'Lahore',
      postalCode: '54792',
      shippingMethod: 'STANDARD',
      shippingCost: 0,
      paymentMethod: 'COD',
      paymentStatus: 'VERIFIED',
      orderStatus: 'DELIVERED',
      subtotal: 18500,
      discountAmount: 1850,
      couponCode: 'ARTISHA10',
      totalAmount: 16650,
      trackingNumber: 'TCS-LHE-9821447',
      courierName: 'TCS Express',
      customerNotes: 'Customer requested complimentary luxury gift wrapping.',
      internalNotes: 'Delivered smoothly by TCS Lahore hub.',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            name: createdProducts[0].name,
            sku: createdProducts[0].sku,
            price: 18500,
            quantity: 1,
            subtotal: 18500,
            imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ART-2026-1002',
      guestName: 'Sana Farooq',
      guestEmail: 'sana.farooq@gmail.com',
      guestPhone: '+92 321 8877665',
      shippingAddress: 'Apartment 4B, Clifton Block 5, Karachi',
      city: 'Karachi',
      postalCode: '75600',
      shippingMethod: 'STANDARD',
      shippingCost: 250,
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'VERIFIED',
      orderStatus: 'PROCESSING',
      subtotal: 12700,
      discountAmount: 0,
      totalAmount: 12950,
      trackingNumber: 'LEO-KHI-4478129',
      courierName: 'Leopards Courier',
      customerNotes: 'Deliver between 2pm to 6pm.',
      internalNotes: 'Bank transfer confirmed via Meezan Bank IBFT.',
      items: {
        create: [
          {
            productId: createdProducts[5].id, // Velvet potli
            name: createdProducts[5].name,
            sku: createdProducts[5].sku,
            price: 7500,
            quantity: 1,
            subtotal: 7500,
            imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1200',
          },
          {
            productId: createdProducts[10].id, // Brass Candle
            name: createdProducts[10].name,
            sku: createdProducts[10].sku,
            price: 5200,
            quantity: 1,
            subtotal: 5200,
            imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200',
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ART-2026-1003',
      guestName: 'Hira Naveed',
      guestEmail: 'hira.naveed@hotmail.com',
      guestPhone: '+92 332 4433221',
      shippingAddress: 'House 18, Street 7, F-7/2, Islamabad',
      city: 'Islamabad',
      postalCode: '44000',
      shippingMethod: 'STANDARD',
      shippingCost: 0,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      subtotal: 26000,
      discountAmount: 2500,
      couponCode: 'WELCOME1000',
      totalAmount: 23500,
      customerNotes: 'Please call recipient prior to delivery.',
      internalNotes: 'New high-value order awaiting dispatch confirmation.',
      items: {
        create: [
          {
            productId: createdProducts[11].id, // Celebration Hamper
            name: createdProducts[11].name,
            sku: createdProducts[11].sku,
            price: 26000,
            quantity: 1,
            subtotal: 26000,
            imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
          },
        ],
      },
    },
  });

  // 8. Payment Transactions
  await prisma.paymentTransaction.createMany({
    data: [
      {
        orderId: order1.id,
        amount: 16650,
        paymentMethod: 'CASH_ON_DELIVERY',
        transactionRef: 'COD-LHE-1001',
        status: 'VERIFIED',
        notes: 'Cash collected by TCS Express courier.',
      },
      {
        orderId: order2.id,
        amount: 12950,
        paymentMethod: 'BANK_TRANSFER',
        transactionRef: 'MEEZAN-IBFT-88492019',
        bankAccount: 'Meezan Bank Ltd (PK92MEZN00018928374)',
        status: 'VERIFIED',
        notes: 'Online IBFT transfer verified with Meezan Bank statement.',
      },
    ],
  });

  // 9. Expenses (Operational cost tracking)
  await prisma.expense.createMany({
    data: [
      {
        title: 'Dolmen Mall Lahore Boutique Monthly Lease (Nov 2026)',
        category: 'BOUTIQUE_RENT',
        amount: 280000,
        date: new Date('2026-11-01'),
        description: 'First Floor Shop 104, Dolmen Mall DHA Lahore lease payment.',
        recordedBy: superAdmin.name,
      },
      {
        title: 'Master Silversmiths & Inlay Artisans Honorarium',
        category: 'ARTISAN_SALARIES',
        amount: 195000,
        date: new Date('2026-11-05'),
        description: 'Wages for master jewellers, filigree artisans and sheesham woodcarvers.',
        recordedBy: superAdmin.name,
      },
      {
        title: 'Pure Freshwater Cultured Pearls & Uncut Polki Procurement',
        category: 'INVENTORY_PROCUREMENT',
        amount: 165000,
        date: new Date('2026-11-10'),
        description: 'Grade-A cultured pearls and uncut polki stones intake for jewellery collection.',
        recordedBy: inventoryManager.name,
      },
      {
        title: 'Rigid Gold Foil Gift Boxes & Velvet Pouches Batch',
        category: 'PACKAGING',
        amount: 48000,
        date: new Date('2026-11-12'),
        description: 'Debossed gold-foil gift boxes, satin ribbons, and padded jewellery suede pouches.',
        recordedBy: orderManager.name,
      },
      {
        title: 'TCS Logistics Nationwide Prepaid Shipping Wallet',
        category: 'COURIER',
        amount: 35000,
        date: new Date('2026-11-15'),
        description: 'Prepaid parcel dispatch credits for COD and online orders.',
        recordedBy: orderManager.name,
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
        action: 'STORE_INITIALIZATION',
        entityType: 'System',
        details: 'Initialized Artisha digital commerce platform for jewellery, accessories and handmade gifts.',
      },
      {
        userId: inventoryManager.id,
        userName: inventoryManager.name,
        userRole: inventoryManager.role,
        action: 'INVENTORY_RESTOCK',
        entityType: 'Product',
        entityId: createdProducts[0].id,
        details: 'Restocked 12 units of Royal Polki & Pearl Choker Set.',
      },
      {
        userId: orderManager.id,
        userName: orderManager.name,
        userRole: orderManager.role,
        action: 'ORDER_DISPATCH',
        entityType: 'Order',
        entityId: order1.id,
        details: 'Assigned TCS tracking TCS-LHE-9821447 and marked order as DELIVERED.',
      },
    ],
  });

  // 11. Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: 'New High-Value Order #ART-2026-1003',
        message: 'Order placed by Hira Naveed for The Imperial Celebration Gift Hamper (Rs. 23,500).',
        type: 'ORDER_NEW',
        link: `/admin/orders`,
        isRead: false,
      },
      {
        title: 'Low Stock Alert: Polki Bridal Matha Patti',
        message: 'Only 7 pieces remaining in stock. Consider commissioning additional pieces from the atelier.',
        type: 'STOCK_LOW',
        link: `/admin/inventory`,
        isRead: false,
      },
      {
        title: 'Payment Verified: Order #ART-2026-1002',
        message: 'Meezan Bank IBFT verified for Rs. 12,950 by Hamza Malik.',
        type: 'PAYMENT_RECEIVED',
        link: `/admin/payments`,
        isRead: true,
      },
    ],
  });

  // 12. Website Content
  const websiteContent = {
    announcement: {
      text: 'Visit our flagship boutique at Dolmen Mall Lahore | Handcrafted Jewellery, Bespoke Accessories & Artisanal Gifts',
      isActive: true,
      link: '/shop',
    },
    hero: {
      tagline: 'AUTUMN / WINTER 2026 HEIRLOOM ATELIER',
      headline: 'Handcrafted Jewellery, Accessories & Artisanal Gifts',
      subheadline: 'Bespoke Polki jewels, embroidered velvet potlis, and handcrafted marble keepsakes from our boutique at Dolmen Mall Lahore.',
      primaryButtonText: 'Explore Atelier',
      primaryButtonLink: '/shop',
      secondaryButtonText: 'Visit Dolmen Mall Boutique',
      secondaryButtonLink: '/contact',
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1800',
    },
    storeInfo: {
      brandName: 'Artisha',
      tagline: 'Handcrafted Jewellery, Bespoke Accessories & Handmade Gifts',
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

  // 13. Newsletter Subscribers
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'zainab.q@gmail.com' },
      { email: 'amber.sheikh@hotmail.com' },
      { email: 'mariam.khan@yahoo.com' },
      { email: 'sarah.ahmed@gmail.com' },
    ],
  });

  console.log('Seeding completed successfully!');
  console.log(`- Created 5 Staff & Customer Accounts`);
  console.log(`- Created 4 Specialized Categories (Jewellery, Accessories, Handmade Gifts, Gift Hampers)`);
  console.log(`- Created 12 Luxury Products with Full Variant & Stock Records`);
  console.log(`- Created 9 Pakistan Shipping Zones, 4 Active Coupons, 3 Sample Orders, Expenses & Audit Logs`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
