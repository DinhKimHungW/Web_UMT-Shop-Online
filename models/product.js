const supabase = require('../config/supabase');

class Product {
  static async getAll({ page = 1, limit = 12, category, q }) {
    // We need to join categories to filter by name if 'category' is a string name
    // Supabase JS syntax for inner join filter: .eq('categories.name', category)
    // Note: This requires a foreign key relationship which we have.
    
    let query = supabase
      .from('products')
      .select('*, product_images(*), categories!inner(*)', { count: 'exact' });

    if (category) {
      // Check if category is numeric (ID) or string (Name)
      if (!isNaN(category)) {
        query = query.eq('category_id', category);
      } else {
        // Filter by category name (case insensitive would be better but eq is sensitive)
        // Let's try to match exact name first.
        // The links use 'sale' but DB has 'On Sale'. We need to map or be exact.
        // For now, let's assume exact match or partial match if we use ilike.
        // But 'sale' != 'On Sale'.
        // Let's map common keywords to DB names.
        let catName = category;
        if (category.toLowerCase() === 'sale') catName = 'On Sale';
        if (category.toLowerCase() === 'hot') catName = 'Hot Products';
        if (category.toLowerCase() === 'food') catName = 'Food';
        if (category.toLowerCase() === 'drink') catName = 'Drink';
        
        query = query.eq('categories.name', catName);
      }
    }

    if (q) {
      query = query.ilike('name', `%${q}%`);
    }

    // Filter out out-of-stock products
    query = query.gt('stock', 0);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { products: data, total: count };
  }

  static async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), categories(*)')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }
}

module.exports = Product;
