// BiteOrder - Menu Controller (Section 10.4 REST API Endpoints)

const categories = [
  { id: 'all', name: 'All Dishes', icon: '🍽️' },
  { id: 'starters', name: 'Starters', icon: '🍢' },
  { id: 'mains', name: 'Main Course', icon: '🍛' },
  { id: 'breads', name: 'Breads', icon: '🫓' },
  { id: 'desserts', name: 'Desserts', icon: '🍨' },
  { id: 'beverages', name: 'Beverages', icon: '☕' },
];

let menuItems = [
  {
    id: 1,
    name: 'Paneer Tikka',
    category: 'starters',
    isVeg: true,
    price: 260,
    halfPrice: 160,
    rating: 4.8,
    ratingCount: 184,
    prepTime: 15,
    calories: '320 kcal',
    description: 'Smoky char-grilled cottage cheese cubes marinated in spiced hung curd with crisp bell peppers and onions.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: false,
    availableAddons: [
      { id: 'extra_cheese', name: 'Extra Cheese', price: 30 },
      { id: 'mint_chutney', name: 'Special Mint Chutney', price: 10 },
      { id: 'extra_spicy', name: 'Extra Spicy Rub', price: 0 },
    ],
  },
  {
    id: 2,
    name: 'Veg Spring Rolls',
    category: 'starters',
    isVeg: true,
    price: 180,
    halfPrice: 110,
    rating: 4.5,
    ratingCount: 96,
    prepTime: 12,
    calories: '240 kcal',
    description: 'Crispy golden fried rolls stuffed with finely shredded cabbage, carrots, bell peppers and scallions.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isBestseller: false,
    isChefSpecial: false,
    availableAddons: [
      { id: 'sweet_chili', name: 'Sweet Chili Dip', price: 15 },
      { id: 'extra_crispy', name: 'Extra Crispy Fried', price: 0 },
    ],
  },
  {
    id: 3,
    name: 'Chicken Wings',
    category: 'starters',
    isVeg: false,
    price: 320,
    halfPrice: 200,
    rating: 4.7,
    ratingCount: 215,
    prepTime: 18,
    calories: '450 kcal',
    description: 'Crispy and succulent chicken wings glazed in spicy African peri-peri sauce, served with garlic mayo dip.',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: true,
    availableAddons: [
      { id: 'extra_peri_sauce', name: 'Extra Peri-Peri Dip', price: 25 },
      { id: 'blue_cheese', name: 'Ranch Dressing', price: 20 },
    ],
  },
  {
    id: 4,
    name: 'Butter Chicken',
    category: 'mains',
    isVeg: false,
    price: 340,
    halfPrice: 220,
    rating: 4.9,
    ratingCount: 340,
    prepTime: 20,
    calories: '520 kcal',
    description: 'Tender tandoor-roasted chicken simmered in a velvety, buttery tomato gravy infused with fenugreek and cream.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: true,
    availableAddons: [
      { id: 'butter_dollop', name: 'Extra White Butter', price: 25 },
      { id: 'boneless_only', name: '100% Boneless Cuts', price: 30 },
    ],
  },
  {
    id: 5,
    name: 'Dal Makhani',
    category: 'mains',
    isVeg: true,
    price: 240,
    halfPrice: 150,
    rating: 4.6,
    ratingCount: 165,
    prepTime: 15,
    calories: '380 kcal',
    description: 'Authentic Punjabi black lentils slow-cooked overnight with creamy butter, rich cream, and Kashmiri chili.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: false,
    availableAddons: [
      { id: 'fresh_cream', name: 'Extra Cream Swirl', price: 20 },
      { id: 'tadka_ghee', name: 'Desi Ghee Tadka', price: 25 },
    ],
  },
  {
    id: 6,
    name: 'Veg Dum Biryani',
    category: 'mains',
    isVeg: true,
    price: 280,
    halfPrice: 180,
    rating: 4.7,
    ratingCount: 198,
    prepTime: 22,
    calories: '440 kcal',
    description: 'Aromatic aged basmati rice slow cooked in a sealed clay handi with seasonal farm vegetables and fragrant saffron.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isBestseller: false,
    isChefSpecial: true,
    availableAddons: [
      { id: 'boondi_raita', name: 'Fresh Boondi Raita', price: 30 },
      { id: 'extra_salan', name: 'Mirchi Ka Salan', price: 20 },
    ],
  },
  {
    id: 7,
    name: 'Butter Naan',
    category: 'breads',
    isVeg: true,
    price: 60,
    halfPrice: 60,
    rating: 4.8,
    ratingCount: 420,
    prepTime: 8,
    calories: '180 kcal',
    description: 'Traditional artisan leavened flatbread freshly baked against clay tandoor walls and generously brushed with butter.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: false,
    availableAddons: [
      { id: 'extra_butter_dip', name: 'Extra Butter Glaze', price: 15 },
    ],
  },
  {
    id: 8,
    name: 'Garlic Naan',
    category: 'breads',
    isVeg: true,
    price: 80,
    halfPrice: 80,
    rating: 4.9,
    ratingCount: 290,
    prepTime: 8,
    calories: '195 kcal',
    description: 'Clay-oven baked flatbread infused with charred minced garlic, fresh cilantro leaves, and melted butter.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isBestseller: false,
    isChefSpecial: true,
    availableAddons: [
      { id: 'cheese_stuffing', name: 'Cheese Stuffed Center', price: 40 },
    ],
  },
  {
    id: 9,
    name: 'Gulab Jamun',
    category: 'desserts',
    isVeg: true,
    price: 110,
    halfPrice: 70,
    rating: 4.9,
    ratingCount: 260,
    prepTime: 5,
    calories: '280 kcal',
    description: 'Two pieces of melt-in-mouth milk solid dumplings steeped in warm saffron and cardamom scented sugar syrup.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: false,
    availableAddons: [
      { id: 'vanilla_scoop', name: 'Vanilla Ice Cream Scoop', price: 40 },
      { id: 'pista_garnish', name: 'Extra Pistachio Flakes', price: 15 },
    ],
  },
  {
    id: 10,
    name: 'Rasmalai',
    category: 'desserts',
    isVeg: true,
    price: 140,
    halfPrice: 90,
    rating: 4.8,
    ratingCount: 175,
    prepTime: 5,
    calories: '260 kcal',
    description: 'Soft and spongy poached chhena discs immersed in delicately chilled condensed saffron milk topped with almonds.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    isBestseller: false,
    isChefSpecial: true,
    availableAddons: [
      { id: 'extra_rabdi', name: 'Extra Kesar Rabdi', price: 30 },
    ],
  },
  {
    id: 11,
    name: 'Masala Chai',
    category: 'beverages',
    isVeg: true,
    price: 50,
    halfPrice: 50,
    rating: 4.6,
    ratingCount: 310,
    prepTime: 5,
    calories: '90 kcal',
    description: 'Strong, steaming Indian milk tea slow-brewed with freshly pounded ginger, green cardamom, cloves, and cinnamon.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isBestseller: true,
    isChefSpecial: false,
    availableAddons: [
      { id: 'jaggery_sub', name: 'Organic Jaggery Sweetener', price: 10 },
      { id: 'kulhad_clay', name: 'Served in Clay Kulhad', price: 10 },
    ],
  },
  {
    id: 12,
    name: 'Fresh Lime Soda',
    category: 'beverages',
    isVeg: true,
    price: 90,
    halfPrice: 90,
    rating: 4.5,
    ratingCount: 140,
    prepTime: 5,
    calories: '70 kcal',
    description: 'Refreshing fizzy soda blended with freshly hand-squeezed yellow lime juice, crushed mint, rock salt and cumin.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isBestseller: false,
    isChefSpecial: false,
    availableAddons: [
      { id: 'sweet_and_salt', name: 'Sweet & Salt Mix', price: 0 },
      { id: 'extra_mint', name: 'Muddled Fresh Mint', price: 10 },
    ],
  },
];

let orders = [];

// GET /api/menu?category=&q=
exports.getMenu = (req, res) => {
  const { category, q } = req.query;
  let items = [...menuItems];

  if (category && category !== 'all') {
    items = items.filter((item) => item.category === category);
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  res.status(200).json(items);
};

// GET /api/categories
exports.getCategories = (req, res) => {
  res.status(200).json(categories);
};

// POST /api/orders
exports.placeOrder = (req, res) => {
  const { tableNumber, orderType, items, subtotal, gst, total, customer } = req.body;
  const newOrder = {
    orderId: `BO-${Math.floor(1000 + Math.random() * 9000)}`,
    tableNumber: tableNumber || '12',
    orderType: orderType || 'dine-in',
    items: items || [],
    subtotal: subtotal || 0,
    gst: gst || 0,
    total: total || 0,
    customer: customer || {},
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  res.status(201).json({
    message: 'Order created successfully',
    order: newOrder,
  });
};

// GET /api/orders/:id
exports.getOrderById = (req, res) => {
  const order = orders.find((o) => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.status(200).json(order);
};
