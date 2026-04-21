import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import SafeImage from '../components/ui/SafeImage';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filterFromUrl = searchParams.get('filter') || 'Todos';
  const sortFromUrl = searchParams.get('sort') || 'Relevancia';

  const [activeFilter, setActiveFilter] = useState(filterFromUrl);
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [isLoading, setIsLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useCartStore((state) => state.showToast);
  const gridRef = useRef(null);

  const filters = ['Todos', 'Nuevos', 'Hombre', 'Mujer', 'Unisex'];

  const updateUrlParams = (newFilter, newSort) => {
    setSearchParams({ filter: newFilter, sort: newSort });
  };

  // 1. SOLUCIÓN AL WARNING DE REACT: Iniciamos la carga al hacer clic
  const handleFilterChange = (newFilter) => {
    setIsLoading(true);
    setActiveFilter(newFilter);
    updateUrlParams(newFilter, sortBy);
  };

  const handleSortChange = (newSort) => {
    setIsLoading(true);
    setSortBy(newSort);
    updateUrlParams(activeFilter, newSort);
  };

  const filteredProducts = products
    .filter(product => {
      if (activeFilter === 'Todos') return true;
      if (activeFilter === 'Nuevos') return product.isNew === true;
      return product.category.includes(activeFilter);
    })
    .sort((a, b) => {
      if (sortBy === 'Precio: Menor a Mayor') return a.price - b.price;
      if (sortBy === 'Precio: Mayor a Menor') return b.price - a.price;
      return 0;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Ya no hacemos setIsLoading(true) aquí para evitar el renderizado en bucle
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeFilter, sortBy]);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(".catalog-card", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans pb-24">
      
      {/* 2. SOLUCIÓN TAILWIND: Cambiamos max-w-[1600px] por max-w-screen-2xl */}
      <div className="pt-32 px-8 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-neutral-100 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter" aria-live="polite">
            {activeFilter === 'Todos' ? 'Todos los Productos' : `${activeFilter}`} ({filteredProducts.length})
          </h1>
          
          <div className="flex gap-8 mt-4 md:mt-0">
            <div className="relative group cursor-pointer flex items-center gap-2 font-bold text-sm" tabIndex="0" role="button" aria-haspopup="true">
              <span>Ordenar por: {sortBy}</span>
              <ChevronDown size={16} />
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-neutral-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 rounded-lg p-2">
                {['Relevancia', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor'].map(option => (
                  <button 
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 rounded-md text-xs font-bold uppercase"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* 3. SOLUCIÓN TAILWIND: Cambiamos flex-shrink-0 por shrink-0 */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-32 h-fit">
            <div className="space-y-8">
              <div>
                <h3 className="font-bold uppercase text-xs tracking-widest mb-6">Categorías</h3>
                <div className="flex flex-col gap-4">
                  {filters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`text-left text-sm transition-all ${
                        activeFilter === filter ? 'font-black underline underline-offset-8' : 'text-neutral-500 hover:text-black'
                      }`}
                      aria-current={activeFilter === filter ? 'page' : undefined}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-8 border-t border-neutral-100">
                <h3 className="font-bold uppercase text-xs tracking-widest mb-4">Promociones</h3>
                <div className="p-4 bg-neutral-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase mb-1">Oferta de Verano</p>
                  <p className="text-xs text-neutral-500">Hasta 20% OFF en siluetas seleccionadas.</p>
                </div>
              </div>
            </div>
          </aside>

          <div ref={gridRef} className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="catalog-card group relative">
                  <div className="bg-neutral-100 aspect-square mb-4 overflow-hidden rounded-xl relative group">
                    <Link to={`/producto/${product.id}`} aria-label={`Ver detalles de ${product.name}`}>
                      {product.isNew && (
                        <span className="absolute top-4 left-4 z-10 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-sm">
                          Nuevo Lanzamiento
                        </span>
                      )}
                      
                      <SafeImage 
                        src={product.image} 
                        alt={`Fotografía de ${product.name}`} 
                        className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out" 
                      />
                    </Link>
                    
                    <button 
                      onClick={() => {
                        addToCart({ ...product, selectedSize: 'US 9' });
                        showToast("Agregado al carrito", "success");
                      }}
                      aria-label={`Agregar ${product.name} al carrito rápidamente`}
                      className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-800 shadow-xl"
                    >
                      <ShoppingBag size={20} aria-hidden="true" />
                    </button>
                  </div>
                  
                  <Link to={`/producto/${product.id}`} className="block px-1" tabIndex="-1">
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-neutral-600 transition-colors">{product.name}</h3>
                    <p className="text-neutral-500 text-sm font-medium mb-2">{product.category}</p>
                    <p className="font-black text-lg">${product.price}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {!isLoading && (
        <section className="mt-32 px-8">
          <div className="max-w-7xl mx-auto bg-neutral-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <span className="text-[20rem] font-black absolute -top-20 -left-20">NIKE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 relative z-10">Unite al club</h2>
            <p className="text-neutral-400 max-w-lg mx-auto mb-10 font-light relative z-10">
              Recibí antes que nadie los lanzamientos exclusivos y las mejores ofertas.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email-newsletter" className="sr-only">Tu correo electrónico</label>
              <input id="email-newsletter" type="email" placeholder="Tu email" className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 focus:outline-none focus:border-white transition-colors text-white placeholder-neutral-400" required />
              <button type="submit" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-sm hover:bg-neutral-200 transition-colors">Suscribirse</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}