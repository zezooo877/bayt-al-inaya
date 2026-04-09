'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/services/productService';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ChevronRight, ShoppingCart, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      if (typeof slug !== 'string') return;
      const data = await getProductBySlug(slug);
      if (!data) {
        // Handle not found
      } else {
        setProduct(data);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>عذراً، المنتج غير موجود</h2>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>العودة للرئيسية</Link>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="container section">
      <nav style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link href="/">الرئيسية</Link>
        <ChevronRight size={14} />
        <span>{product.category?.name_ar}</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Image Gallery */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ 
            aspectRatio: '1/1', 
            background: 'var(--bg-soft)', 
            borderRadius: 'var(--radius)', 
            overflow: 'hidden',
            marginBottom: '1rem',
            border: '1px solid var(--border)'
          }}>
            <Image 
              src={product.images && product.images[activeImage] ? product.images[activeImage] : 'https://placehold.co/600x600/e0f2f1/008489?text=🏥'} 
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  style={{ 
                    minWidth: '70px', 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    border: activeImage === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                    opacity: activeImage === idx ? 1 : 0.6,
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>فئة: {product.category?.name_ar}</p>

          <div style={{ background: 'var(--bg-soft)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>
                {discountedPrice.toLocaleString()} د.ع
              </span>
              {product.discount && product.discount > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {product.price.toLocaleString()} د.ع
                  </span>
                  <span className="badge badge-discount" style={{ width: 'fit-content', fontSize: '0.75rem' }}>
                    توفير {product.discount}%
                  </span>
                </div>
              )}
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={() => addToCart(product)}
              style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', height: '60px', fontSize: '1.1rem' }}
            >
              <ShoppingCart size={20} />
              إضافة للسلة
            </button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', borderBottom: '2px solid var(--primary)', width: 'fit-content', paddingBottom: '0.25rem' }}>وصف المنتج</h3>
            <p style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', lineHeight: 1.8 }}>
              {product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
            <div className="flex items-center gap-3" style={{ padding: '1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <ShieldCheck size={24} color="var(--primary)" />
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ display: 'block', fontWeight: 700 }}>منتج أصلي 100%</span>
                <span style={{ color: 'var(--text-muted)' }}>نضمن جودة المنتج</span>
              </div>
            </div>
            <div className="flex items-center gap-3" style={{ padding: '1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <Truck size={24} color="var(--primary)" />
              <div style={{ fontSize: '0.8rem' }}>
                <span style={{ display: 'block', fontWeight: 700 }}>توصيل سريع</span>
                <span style={{ color: 'var(--text-muted)' }}>لكافة مناطق العراق</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <div className="mobile-only" style={{
        position: 'fixed',
        bottom: 0, 
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid var(--border)',
        padding: '0.75rem 1.5rem env(safe-area-inset-bottom)',
        zIndex: 900,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>السعر:</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{discountedPrice.toLocaleString()} د.ع</span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => addToCart(product)}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <ShoppingCart size={18} />
          إضافة
        </button>
      </div>
    </div>
  );
}
