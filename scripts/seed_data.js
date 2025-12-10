require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: 'Food' },
  { name: 'Drink' },
  { name: 'On Sale' },
  { name: 'Hot Products' },
  { name: 'Electronics' },
  { name: 'Fashion' }
];

const productNames = [
  'Smartphone X', 'Laptop Pro', 'Wireless Earbuds', 'Smart Watch', 'Gaming Mouse',
  'Mechanical Keyboard', '4K Monitor', 'Bluetooth Speaker', 'Tablet Air', 'Power Bank',
  'Running Shoes', 'Cotton T-Shirt', 'Jeans Classic', 'Hoodie Supreme', 'Baseball Cap',
  'Backpack Travel', 'Sunglasses Aviator', 'Leather Wallet', 'Wrist Watch', 'Sneakers High',
  'Fried Chicken', 'Burger King', 'Pizza Pepperoni', 'Spaghetti Bolognese', 'Sushi Set',
  'Banh Mi', 'Pho Bo', 'Com Tam', 'Spring Rolls', 'Dim Sum',
  'Coca Cola', 'Pepsi', 'Iced Coffee', 'Milk Tea', 'Orange Juice',
  'Smoothie Mango', 'Green Tea', 'Mineral Water', 'Beer Heineken', 'Red Wine',
  'Desk Lamp', 'Office Chair', 'Notebook Moleskine', 'Pen Parker', 'Stapler',
  'Scissors', 'Tape Dispenser', 'Calculator', 'File Organizer', 'Whiteboard'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('Starting seed...');

  // 1. Insert Categories
  console.log('Inserting categories...');
  // First check existing categories to avoid duplicates manually since name might not be unique constraint in DB yet
  // Actually db_init.sql didn't specify UNIQUE for name in categories table? 
  // Let's check db_init.sql: "name VARCHAR(100) NOT NULL" - no UNIQUE.
  // We should just insert if not exists or ignore.
  
  // Let's just insert and ignore errors or fetch first.
  const { data: existingCats } = await supabase.from('categories').select('name, id');
  const existingCatNames = existingCats ? existingCats.map(c => c.name) : [];
  
  const newCats = categories.filter(c => !existingCatNames.includes(c.name));
  
  if (newCats.length > 0) {
    const { error: catError } = await supabase
      .from('categories')
      .insert(newCats);
      
    if (catError) {
      console.error('Error inserting categories:', catError);
      return;
    }
  }

  const { data: allCats } = await supabase.from('categories').select('*');
  const catMap = {};
  allCats.forEach(c => catMap[c.name] = c.id);

  // 2. Generate Products
  const products = [];
  for (let i = 0; i < 50; i++) {
    const name = productNames[i] || `Product ${i + 1}`;
    let catName = 'Electronics';
    if (i >= 20 && i < 30) catName = 'Food';
    if (i >= 30 && i < 40) catName = 'Drink';
    if (i >= 40) catName = 'Fashion';
    
    // Randomly assign 'On Sale' or 'Hot Products' to some
    if (Math.random() > 0.8) catName = 'On Sale';
    if (Math.random() > 0.9) catName = 'Hot Products';

    products.push({
      name: name,
      slug: name.toLowerCase().replace(/ /g, '-') + '-' + getRandomInt(1000, 9999),
      description: `This is a description for ${name}. High quality and best price.`,
      price: getRandomInt(10000, 5000000),
      stock: getRandomInt(10, 100),
      category_id: catMap[catName] || catMap['Electronics'],
      is_active: true
    });
  }

  console.log('Inserting products...');
  const { data: prodData, error: prodError } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (prodError) {
    console.error('Error inserting products:', prodError);
    return;
  }

  // 3. Insert Images
  console.log('Inserting product images...');
  const images = [];
  prodData.forEach(p => {
    images.push({
      product_id: p.id,
      url: `https://picsum.photos/seed/${p.id}/300/300`,
      alt: p.name
    });
  });

  const { error: imgError } = await supabase
    .from('product_images')
    .insert(images);

  if (imgError) {
    console.error('Error inserting images:', imgError);
    return;
  }

  console.log('Seed completed successfully!');
}

seed();
