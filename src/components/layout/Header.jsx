import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore'; 

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartItems = useCartStore((state) => state.cartItems);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const setIsSearchOpen = useCartStore((state) => state.setIsSearchOpen);

  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const navLinks = [
    { name: 'Nuevos Lanzamientos', path: '/' },
    { name: 'Hombre', path: '/hombre' },
    { name: 'Mujer', path: '/mujer' },
    { name: 'Catálogo', path: '/catalogo' }
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50">
      
      {/* 1. BARRA SUPERIOR (Siempre visible y por encima de todo) */}
      <div className="relative z-50 bg-white border-b border-neutral-100 px-6 md:px-12 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter" onClick={handleLinkClick}>
          NIKE
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="text-sm font-medium hover:text-neutral-500 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Iconos */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <Search size={20} />
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Menú Hamburguesa */}
          <button 
            className="p-2 md:hidden hover:bg-neutral-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 2. MENÚ DESPLEGABLE MÓVIL (Por debajo de la barra superior) */}
      <div 
        className={`md:hidden absolute top-0 left-0 w-full h-screen bg-white z-40 transition-transform duration-300 ease-in-out flex flex-col ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="pt-24 px-8 flex flex-col gap-8 flex-1">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="text-4xl font-black uppercase tracking-tighter hover:text-neutral-500 transition-colors"
              onClick={handleLinkClick}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="p-8 border-t border-neutral-100 mt-auto">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Proyecto Portfolio
          </p>
        </div>
      </div>

    </header>
  );
}