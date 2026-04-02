import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useCartStore } from '../../store/useCartStore';
import { products } from '../../data/products';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
      gsap.to(modalRef.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(contentRef.current, 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = 'auto';
      gsap.to(modalRef.current, { autoAlpha: 0, duration: 0.3, ease: "power2.in" });
      setTimeout(() => setSearchTerm(''), 300); // Limpia el texto al cerrar
    }
  }, [isSearchOpen]);

  // Lógica de filtrado en tiempo real
  const filteredProducts = searchTerm
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div ref={modalRef} className="fixed inset-0 z-[60] invisible bg-black/80 backdrop-blur-md flex justify-center pt-24 px-8">
      
      {/* Botón de cierre */}
      <button 
        onClick={() => setIsSearchOpen(false)} 
        className="absolute top-8 right-8 text-white hover:text-neutral-400 transition-colors"
      >
        <X size={40} strokeWidth={1} />
      </button>

      <div ref={contentRef} className="w-full max-w-4xl flex flex-col gap-10">
        
        {/* Input gigante minimalista */}
        <div className="relative flex items-center border-b border-white/30 pb-4">
          <Search size={32} className="text-white/50 mr-4" />
          <input 
            type="text" 
            placeholder="Buscar zapatillas, categorías..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white text-3xl md:text-5xl font-black uppercase outline-none placeholder:text-white/20"
            autoFocus={isSearchOpen}
          />
        </div>

        {/* Resultados */}
        <div className="overflow-y-auto max-h-[60vh] hide-scrollbar pr-4">
          {searchTerm && filteredProducts.length === 0 && (
            <p className="text-white/50 text-xl font-light">No encontramos nada con "{searchTerm}".</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <Link 
                to={`/producto/${product.id}`} 
                key={product.id}
                onClick={() => setIsSearchOpen(false)} // Cierra el modal al hacer clic
                className="flex items-center gap-6 group hover:bg-white/10 p-4 rounded-xl transition-colors"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-24 h-24 object-cover rounded-md grayscale group-hover:grayscale-0 transition-all"
                />
                <div>
                  <h3 className="text-white font-bold text-xl uppercase group-hover:text-neutral-300">{product.name}</h3>
                  <p className="text-neutral-400 text-sm">{product.category}</p>
                  <p className="text-white font-medium mt-1">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}