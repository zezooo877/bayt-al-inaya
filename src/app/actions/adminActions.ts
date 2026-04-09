'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { Product, SupabaseProductResponse } from '@/types';

export async function adminGetProductsAction() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    // We return empty but the frontend will check a status property if we had one.
    // For now, let's keep it consistent but improve the catch in the dashboard.
    return [] as Product[];
  }
  
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      product_images(image_url),
      categories(name_ar)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Database Error: ${error.message}`);

  return ((data as unknown) as SupabaseProductResponse[] || []).map((item) => ({
    ...item,
    category: item.categories,
    images: item.product_images?.map((img) => img.image_url) || []
  })) as Product[];
}

export async function adminUpsertProductAction(product: Partial<Product>, imageFiles: string[]) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    throw new Error('فشل الاتصال بقاعدة البيانات الإدارية. يرجى التأكد من إضافة SUPABASE_SERVICE_ROLE_KEY في إعدادات Vercel.');
  }
  
  const { id, name, description, price, discount, category_id, in_stock, slug } = product;

  // Better slug generation for Arabic and English
  // 1. Remove special characters except spaces and alphanumeric
  // 2. Replace spaces with dashes
  // 3. Limit length
  const generatedSlug = slug || name
    ?.trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // Keep Arabic, English, Numbers, Spaces, Dashes
    .replace(/\s+/g, '-')                      // Spaces to dashes
    .replace(/-+/g, '-')                       // Double dashes to single
    .slice(0, 50);

  if (!generatedSlug) throw new Error('يرجى إدخال اسم صحيح للمنتج لتوليد رابط صالح.');

  // 1. Upsert product
  const { data: prodData, error: prodError } = await supabaseAdmin
    .from('products')
    .upsert({
      id,
      name,
      description,
      price,
      discount,
      category_id,
      in_stock,
      slug: generatedSlug
    })
    .select()
    .single();

  if (prodError) {
    console.error('Upsert Error:', prodError);
    if (prodError.code === '23505') throw new Error('هذا المنتج موجود بالفعل أو الرابط مستخدم لمنتج آخر.');
    throw new Error(`خطأ في حفظ المنتج: ${prodError.message}`);
  }

  // 2. Handle images
  if (prodData && imageFiles.length > 0) {
    await supabaseAdmin.from('product_images').delete().eq('product_id', prodData.id);

    const imageData = imageFiles.map(url => ({
      product_id: prodData.id,
      image_url: url
    }));

    const { error: imgError } = await supabaseAdmin.from('product_images').insert(imageData);
    if (imgError) throw new Error(`خطأ في حفظ الصور: ${imgError.message}`);
  }

  return prodData;
}

export async function adminDeleteProductAction(id: string) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function adminToggleStockAction(id: string, inStock: boolean) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  
  const { error } = await supabaseAdmin
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
