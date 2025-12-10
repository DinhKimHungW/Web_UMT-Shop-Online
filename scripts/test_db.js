require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Testing connection to:', supabaseUrl);
console.log('Using Key (first 10 chars):', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'None');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Attempting to fetch products with images...');
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .range(0, 1);
    
    if (error) {
      console.error('Query failed!');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Hint:', error.hint);
    } else {
      console.log('Query successful!');
      console.log('Data retrieved:', data.length, 'items');
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

testConnection();
