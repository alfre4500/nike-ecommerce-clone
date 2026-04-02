import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ShoppingBag, ChevronDown, Filter } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';
import ProductSkeleton from '../components/ui/ProductSkeleton';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterFromUrl = searchParams.get('filter') || 'Todos';

  const [activeFilter, setActiveFilter] = useState(filterFromUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Relevancia');
  const addToCart = useCartStore((state) => state.addToCart);
  const showToast = useCartStore((state) => state.showToast);
  const gridRef = useRef(null);

  const filters = ['Todos', 'Nuevos', 'Hombre', 'Mujer', 'Unisex'];

  useEffect(() => {
    setActiveFilter(filterFromUrl);
  }, [filterFromUrl]);

  // Lógica de filtrado y orden
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

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    setSearchParams({ filter: newFilter });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
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
      
      {/* 1. HEADER DEL CATÁLOGO (Más minimalista y limpio) */}
      <div className="pt-32 px-8 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-neutral-100 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            {activeFilter === 'Todos' ? 'Todos los Productos' : `${activeFilter}`} ({filteredProducts.length})
          </h1>
          
          <div className="flex gap-8 mt-4 md:mt-0">
            <div className="relative group cursor-pointer flex items-center gap-2 font-bold text-sm">
              <span>Ordenar por: {sortBy}</span>
              <ChevronDown size={16} />
              {/* Dropdown de Orden */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-neutral-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 rounded-lg p-2">
                {['Relevancia', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor'].map(option => (
                  <button 
                    key={option}
                    onClick={() => setSortBy(option)}
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
          
          {/* 2. SIDEBAR DE FILTROS (Solo visible en desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0 sticky top-32 h-fit">
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

          {/* 3. GRILLA DE PRODUCTOS */}
          <div ref={gridRef} className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="catalog-card group relative">
                  <div className="bg-neutral-100 aspect-square mb-4 overflow-hidden rounded-xl relative group">
                    <Link to={`/producto/${product.id}`}>
                      {/* BADGES DINÁMICOS */}
                      {product.isNew && (
                        <span className="absolute top-4 left-4 z-10 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter shadow-sm">
                          Nuevo Lanzamiento
                        </span>
                      )}
                      
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out" 
                      />
                    </Link>
                    
                    <button 
                      onClick={() => {
                        addToCart({ ...product, selectedSize: 'US 9' });
                        showToast("Agregado al carrito", "success");
                      }}
                      className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-800 shadow-xl"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                  
                  <Link to={`/producto/${product.id}`} className="block px-1">
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

      {/* 4. SECCIÓN DE NEWSLETTER (Para darle cuerpo al final) */}
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
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative z-10">
              <input type="email" placeholder="Tu email" className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 focus:outline-none focus:border-white transition-colors" />
              <button className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-sm hover:bg-neutral-200 transition-colors">Suscribirse</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}