const supabase = require('../config/supabase');

class Category {
  static async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async create(name) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

module.exports = Category;
