'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const { totalItems, cart, updateQuantity, removeFromCart, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    let message = `طلبية جديدة من بيت العناية:\n--------------------------\n`;
    cart.forEach((item, index) => {
      const price = item.price * (1 - (item.discount || 0) / 100);
      message += `${index + 1}. ${item.name} x ${item.quantity} - ${price.toLocaleString()} د.ع\n`;
    });
    message += `--------------------------\nالمجموع الكلي: ${totalPrice.toLocaleString()} د.ع`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/9647752227022?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <nav className="navbar" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 0'
      }}>
        <div className="container flex justify-between items-center">
          <Link href="/" className="logo flex items-center gap-2">
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              color: 'var(--primary)',
              letterSpacing: '-0.5px'
            }}>بيت العناية</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>| Bayt Al-Inaya</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="search-trigger desktop-only" style={{ color: 'var(--text-muted)' }}>
              <Search size={22} />
            </button>
            <button 
              className="cart-trigger flex items-center gap-1" 
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative' }}
            >
              <ShoppingCart size={24} color="var(--primary)" />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--accent)',
                  color: 'white',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  borderRadius: '50%'
                }}
              >
                {totalItems}
              </span>
              )}
            </button>
            <button className="mobile-menu-trigger desktop-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1000
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 20px rgba(0,0,0,0.1)'
              }}
              dir="rtl"
            >
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>سلة التسوق</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>السلة فارغة حالياً</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg-soft)', overflow: 'hidden', position: 'relative' }}>
                          {item.images && item.images[0] ? (
                            <Image src={item.images[0]} alt={item.name} fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏥</div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name}</h4>
                          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                            {(item.price * (1 - (item.discount || 0) / 100)).toLocaleString()} د.ع
                          </p>
                          <div className="flex items-center gap-3" style={{ marginTop: '0.5rem' }}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '2px', border: '1px solid var(--border)', borderRadius: '4px' }}><Minus size={14} /></button>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '2px', border: '1px solid var(--border)', borderRadius: '4px' }}><Plus size={14} /></button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff5252' }}><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg-soft)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600 }}>المجموع الكلي</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{totalPrice.toLocaleString()} د.ع</span>
                  </div>
                  <button className="btn btn-primary" onClick={handleCheckout} style={{ width: '100%', padding: '1rem' }}>
                    اتمام الطلب عبر واتساب
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
