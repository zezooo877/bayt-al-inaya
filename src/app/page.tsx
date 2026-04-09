'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Hero from '@/components/Hero';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories, searchProducts } from '@/services/productService';
import { Product, Category } from '@/types';
import { Loader2, Search } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleCategorySelect = async (id: string | null) => {
    setLoading(true);
    setActiveCategory(id);
    try {
      const prods = await getProducts(id || undefined);
      setProducts(prods);
    } catch (error) {
      console.error('Failed to load category products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handleCategorySelect(activeCategory);
      return;
    }
    setLoading(true);
    try {
      const results = await searchProducts(searchQuery);
      setProducts(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero />
      
      <div id="categories">
        <CategoryBar 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={handleCategorySelect} 
        />
      </div>

      <section className="section" id="search">
        <div className="container">
          <div className="home-header-row" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
              {activeCategory 
                ? categories.find(c => c.id === activeCategory)?.name_ar 
                : 'أحدث المنتجات'}
            </h2>
            
            <form onSubmit={handleSearch} style={{ 
              position: 'relative',
              flex: '1',
              minWidth: '280px',
              maxWidth: '400px'
            }}>
              <input 
                type="text" 
                placeholder="ابحث عن منتج..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  width: '100%',
                  background: 'var(--bg-soft)',
                  transition: 'all 0.2s'
                }}
              />
              <Search 
                size={18} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
            </form>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
              <p>لا توجد منتجات في هذه الفئة حالياً.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
