'use client';

import React from 'react';
import { Category } from '@/types';
import Image from 'next/image';

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryBar({ categories, activeCategory, onSelect }: CategoryBarProps) {
  // Fallback cartoon icons for common categories
  const getFallbackIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('شعر') || n.includes('hair')) return 'https://cdn-icons-png.flaticon.com/512/3468/3468192.png'; // Hair
    if (n.includes('بشرة') || n.includes('skin') || n.includes('وجه')) return 'https://cdn-icons-png.flaticon.com/512/3163/3163195.png'; // Skin
    if (n.includes('طفل') || n.includes('baby')) return 'https://cdn-icons-png.flaticon.com/512/3120/3120111.png'; // Baby
    if (n.includes('جسم') || n.includes('body')) return 'https://cdn-icons-png.flaticon.com/512/1047/1047461.png'; // Body
    if (n.includes('عطر') || n.includes('perfume')) return 'https://cdn-icons-png.flaticon.com/512/3163/3163212.png'; // Perfume
    if (n.includes('عناية') || n.includes('care')) return 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png'; // General Care
    return 'https://cdn-icons-png.flaticon.com/512/1047/1047551.png'; // Default
  };

  return (
    <div style={{ 
      background: 'var(--bg-main)', 
      padding: '1.5rem 0', 
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: '64px',
      zIndex: 90
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        gap: '1rem', 
        overflowX: 'auto', 
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        whiteSpace: 'nowrap',
        justifyContent: 'flex-start',
        direction: 'rtl'
      }}>
        {/* "All" Category */}
        <button
          onClick={() => onSelect(null)}
          className={`category-item ${activeCategory === null ? 'active' : ''}`}
        >
          <div className="category-icon-wrapper">
            <span style={{ fontSize: '1.5rem' }}>🏥</span>
          </div>
          <span className="category-name">الكل</span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
          >
            <div className="category-icon-wrapper">
              <Image 
                src={cat.icon_url || getFallbackIcon(cat.name_ar)} 
                alt={cat.name_ar}
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span className="category-name">{cat.name_ar}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
