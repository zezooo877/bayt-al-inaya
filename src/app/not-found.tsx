import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary-soft)', marginBottom: '-1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>الصفحة غير موجودة</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>عذراً، الرابط الذي تحاول الوصول إليه غير متاح حالياً.</p>
      <Link href="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
        <Home size={18} />
        العودة للرئيسية
      </Link>
    </div>
  );
}
