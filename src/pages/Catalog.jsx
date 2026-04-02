import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';
import ProductSkeleton from '../components/ui/ProductSkeleton'; // Asegúrate de tener este componente creado

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true); // Nuevo: Estado para controlar la carga
  const addToCart = useCartStore((state) => state.addToCart);
  const gridRef = useRef(null);

  const filters = ['Todos', 'Hombre', 'Mujer', 'Unisex'];

  // Filtrado de productos
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'Todos') return true;
    return product.category.includes(activeFilter);
  });

  // 1. Simulación de carga cada vez que cambia el filtro
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // 1.2 segundos es el "sweet spot" para que no canse pero se note el efecto

    return () => clearTimeout(timer);
  }, [activeFilter]);

  // 2. Animación de GSAP (solo cuando termina de cargar)
  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".catalog-card", 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      }, gridRef);
      return () => ctx.revert();
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pt-24 px-8 md:px-24 max-w-7xl mx-auto pb-24">
      
      {/* Cabecera del Catálogo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Catálogo Completo</h1>
          <p className="text-neutral-500 font-light">Explora todas nuestras siluetas y encuentra tu estilo ideal.</p>
        </div>

        {/* Botones de Filtro */}
        <div className="flex gap-2 flex-wrap">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-black text-white' 
                  : 'border border-neutral-200 text-neutral-500 hover:border-black hover:text-black'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de Resultados / Skeletons */}
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        
        {isLoading ? (
          // Mostramos 8 Skeletons mientrasisLoading es true
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        ) : (
          // Mostramos los productos reales cuando termina la carga
          filteredProducts.map((product) => (
            <div key={product.id} className="catalog-card group cursor-pointer">
              <div className="bg-neutral-100 aspect-square mb-4 overflow-hidden rounded-xl relative">
                <Link to={`/producto/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                  />
                </Link>
                <button 
                  onClick={() => addToCart({ ...product, selectedSize: 'US 9' })} 
                  className="absolute bottom-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-200 shadow-md"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
              <Link to={`/producto/${product.id}`} className="block">
                <h3 className="font-bold text-lg hover:text-neutral-600 transition-colors">{product.name}</h3>
                <p className="text-neutral-500 text-sm">{product.category}</p>
                <p className="font-medium mt-2">${product.price}</p>
              </Link>
            </div>
          ))
        )}

        {/* Estado vacío */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-24 text-neutral-400">
            No hay productos disponibles para esta categoría.
          </div>
        )}
      </div>

    </div>
  );
}