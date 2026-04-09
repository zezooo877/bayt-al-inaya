'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section style={{ 
      position: 'relative',
      padding: '4rem 0',
      background: 'linear-gradient(135deg, #E0F2F1 0%, var(--bg-main) 100%)',
      overflow: 'hidden'
    }}>
      {/* Decorative shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'var(--primary-soft)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: 0.6,
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '600px', textAlign: 'right' }}>
          <motion.h1 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', 
              fontWeight: 900, 
              color: 'var(--primary-dark)',
              lineHeight: 1.1,
              marginBottom: '1.5rem'
            }}
          >
            بيت العناية <br />
            <span style={{ color: 'var(--secondary)' }}>لصحتكم وجمالكم</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              fontSize: '1.1rem', 
              color: 'var(--text-muted)', 
              marginBottom: '2.5rem',
              maxWidth: '500px'
            }}
          >
            نقدم لكم مجموعة مختارة بعناية من أفضل المنتجات الطبية والتجميلية العالمية. جودة نثق بها، لنتائج تستحقونها.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>تسوق الآن</button>
            <button className="btn btn-outline" style={{ padding: '1rem 2rem' }}>عن بيت العناية</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
