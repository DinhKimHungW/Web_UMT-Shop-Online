const supabase = require('../config/supabase');

class Review {
  static async create(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getByProductId(productId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Review;
