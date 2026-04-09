'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="card product-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <Link href={`/product/${product.slug}`} style={{ flex: 1 }}>
        <div style={{ 
          position: 'relative', 
          aspectRatio: '1/1', 
          background: 'var(--bg-soft)',
          overflow: 'hidden'
        }}>
          <Image 
            src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/400x400/e0f2f1/008489?text=🏥'} 
            alt={product.name}
            fill
            className="image-hover"
            style={{ objectFit: 'contain', padding: '1rem' }}
          />
          {product.discount && product.discount > 0 && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
              <span className="badge badge-discount">خصم {product.discount}%</span>
            </div>
          )}
          {!product.in_stock && (
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'rgba(255,255,255,0.7)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 2
            }}>
              <span className="badge badge-out" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>نفذت الكمية</span>
            </div>
          )}
        </div>
        
        <div style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{product.category?.name_ar}</p>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.4rem'
          }}>{product.name}</h3>
          
          <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
            <div className="flex flex-col">
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{discountedPrice.toLocaleString()} د.ع</span>
              {product.discount && product.discount > 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{product.price.toLocaleString()} د.ع</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        <button 
          className="btn btn-primary" 
          disabled={!product.in_stock}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem' }}
        >
          <ShoppingCart size={18} />
          إضافة للسلة
        </button>
      </div>
    </div>
  );
}
