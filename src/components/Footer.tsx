import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--bg-soft)', 
      padding: '4rem 0 2rem', 
      borderTop: '1px solid var(--border)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '3rem',
          direction: 'rtl'
        }}>
          <div>
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '1rem' }}>بيت العناية</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              وجهتكم الأولى للعناية بالبشرة والشعر والمكملات الغذائية. نوفر لكم أفضل المنتجات العالمية والمحلية بجودة عالية.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>روابط سريعة</h4>
            <ul className="flex flex-col gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/shop">المتجر</Link></li>
              <li><Link href="/about">عن الصيدلية</Link></li>
              <li><Link href="/contact">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>الفئات</h4>
            <ul className="flex flex-col gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link href="/category/hair-care">العناية بالشعر</Link></li>
              <li><Link href="/category/skincare">العناية بالبشرة</Link></li>
              <li><Link href="/category/supplements">المكملات الغذائية</Link></li>
              <li><Link href="/category/baby-care">العناية بالطفل</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>تواصل معنا</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              هاتف: 07752227022
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              العنوان: العراق، بغداد
            </p>
          </div>
        </div>

        <div style={{ 
          marginTop: '4rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid rgba(0,0,0,0.05)', 
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          &copy; {new Date().getFullYear()} بيت العناية | Bayt Al-Inaya. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
