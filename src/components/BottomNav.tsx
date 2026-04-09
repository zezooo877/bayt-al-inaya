'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Grid, Search, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  // Don't show on admin pages or product details to avoid clutter
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/product')) return null;

  const navItems = [
    { label: 'الرئيسية', icon: Home, href: '/' },
    { label: 'الأقسام', icon: Grid, href: '/#categories' },
    { label: 'بحث', icon: Search, href: '/#search' },
    { label: 'السلة', icon: ShoppingBag, onClick: () => setIsCartOpen(true) },
  ];

  return (
    <div className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      padding: '0.75rem 1rem env(safe-area-inset-bottom)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        const content = (
          <>
            <div style={{
              padding: '4px 16px',
              borderRadius: '16px',
              background: isActive ? 'var(--primary-soft)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
            
            {item.label === 'السلة' && totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '25%',
                background: 'var(--accent)',
                color: 'white',
                width: '18px',
                height: '18px',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                borderRadius: '50%',
                border: '2px solid white'
              }}>
                {totalItems}
              </span>
            )}
          </>
        );

        if (item.onClick) {
          return (
            <button 
              key={item.label} 
              onClick={item.onClick}
              className="flex flex-col items-center gap-1"
              style={{ color: 'var(--text-muted)', position: 'relative', flex: 1 }}
            >
              {content}
            </button>
          );
        }

        return (
          <Link 
            key={item.label} 
            href={item.href!}
            className="flex flex-col items-center gap-1"
            style={{ 
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative',
              flex: 1
            }}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
