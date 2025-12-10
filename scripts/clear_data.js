require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
  console.log('Clearing data...');

  // Delete in order of foreign key dependencies
  const tables = [
    'order_items',
    'orders',
    'cart_items',
    'carts',
    'reviews',
    'product_images',
    'products',
    'categories',
    'vouchers',
    'logs'
    // We keep users and roles usually, but if you want a full wipe:
    // 'users'
  ];

  for (const table of tables) {
    console.log(`Deleting from ${table}...`);
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', 0); // Delete all rows (id is usually > 0)
      
    // For UUID tables or if neq id 0 doesn't work for all, we might need another strategy
    // But for standard serial IDs it works. For UUIDs we can use neq id '00000000-0000-0000-0000-000000000000'
    
    if (error) {
        // Try deleting with a different condition if the first one fails or for UUIDs
        const { error: err2 } = await supabase.from(table).delete().neq('created_at', '1970-01-01');
        if (err2) console.error(`Error deleting ${table}:`, error);
    }
  }

  console.log('Data cleared!');
}

clearData();
