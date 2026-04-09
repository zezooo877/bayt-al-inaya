'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  adminGetProductsAction, 
  adminUpsertProductAction, 
  adminDeleteProductAction, 
  adminToggleStockAction 
} from '@/app/actions/adminActions';
import { getCategories } from '@/services/productService';
import { Product, Category } from '@/types';
import { Trash2, Edit, Plus, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['', '', '', '']); // 4 image slots

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      setCategories(cats);
      const prods = await adminGetProductsAction();
      setProducts(prods);
    } catch (err) {
      console.error(err);
      alert('خطأ في تحميل البيانات. تأكد من إعدادات Supabase.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // defer state update to break synchronous effect cycle
    const timeout = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadData]);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price.toString());
    setDiscount(p.discount?.toString() || '0');
    setCategoryId(p.category_id);
    setDescription(p.description || '');
    const currentImages = [...(p.images || [])];
    while (currentImages.length < 4) currentImages.push('');
    setImages(currentImages.slice(0, 4));
    setIsFormOpen(true);
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDiscount('0');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setImages(['', '', '', '']);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const validImages = images.filter(url => url.trim() !== '');
      await adminUpsertProductAction({
        id: editingProduct?.id,
        name,
        price: parseFloat(price),
        discount: parseFloat(discount),
        category_id: categoryId,
        description,
        in_stock: editingProduct ? editingProduct.in_stock : true,
      }, validImages);
      
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('خطأ في حفظ المنتج.');
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await adminDeleteProductAction(id);
      loadData();
    } catch {
      alert('خطأ في الحذف.');
    }
  };

  const handleToggleStock = async (id: string, current: boolean) => {
    try {
      await adminToggleStockAction(id, !current);
      loadData();
    } catch {
      alert('خطأ في تحديث التوفر.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', direction: 'rtl' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        <span style={{ marginRight: '1rem' }}>جاري تحميل لوحة التحكم...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', direction: 'rtl' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>لوحة الإدارة | بيت العناية</h1>
          <p style={{ color: 'var(--text-muted)' }}>إدارة المنتجات والمخزون</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenNew}>
          <Plus size={20} />
          إضافة منتج جديد
        </button>
      </div>

      {/* Product List */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>المنتج</th>
              <th style={{ padding: '1rem' }}>الفئة</th>
              <th style={{ padding: '1rem' }}>السعر</th>
              <th style={{ padding: '1rem' }}>الحالة</th>
              <th style={{ padding: '1rem' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                      <Image 
                        src={p.images && p.images[0] ? p.images[0] : 'https://placehold.co/50x50'} 
                        alt={p.name}
                        fill
                        style={{ borderRadius: '4px', objectFit: 'cover' }} 
                      />
                    </div>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.category?.name_ar}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontWeight: 700 }}>{p.price.toLocaleString()} د.ع</span>
                  {p.discount && p.discount > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--accent)', marginRight: '0.5rem' }}>(-{p.discount}%)</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => handleToggleStock(p.id, p.in_stock)}
                    className={`badge ${p.in_stock ? 'badge-stock' : 'badge-out'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {p.in_stock ? 'متوفر' : 'غير متوفر'}
                  </button>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} style={{ color: 'var(--primary)', padding: '4px' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--accent)', padding: '4px' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 800 }}>{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setIsFormOpen(false)}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>اسم المنتج</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>الفئة</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>السعر (د.ع)</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>الخصم (%)</label>
                  <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none' }} />
                </div>
              </div>

              <div className="flex flex-col gap-1" style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>الوصف</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
              </div>

              <div className="flex flex-col gap-1" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>روابط الصور (بحد أقصى 4)</label>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {images.map((url, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <input 
                        placeholder={`رابط الصورة ${idx + 1}`}
                        value={url} 
                        onChange={(e) => {
                          const newImages = [...images];
                          newImages[idx] = e.target.value;
                          setImages(newImages);
                        }} 
                        style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px', outline: 'none', width: '100%', fontSize: '0.8rem' }} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  حفظ المنتج
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
