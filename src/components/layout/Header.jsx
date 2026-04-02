import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  // Extraemos también setIsSearchOpen
  const { cartItems, setIsCartOpen, setIsSearchOpen } = useCartStore();

  return (
    <header className="flex justify-between items-center px-6 md:px-8 py-5 bg-white border-b border-neutral-100 sticky top-0 z-40">
      <Link to="/" className="text-3xl font-black tracking-tighter">NIKE</Link>
      
      <nav className="hidden md:flex gap-8 text-sm font-medium">
        <Link to="/" className="hover:text-neutral-500 transition-colors">Nuevos</Link>
        <a href="#" className="hover:text-neutral-500 transition-colors">Hombre</a>
        <a href="#" className="hover:text-neutral-500 transition-colors">Mujer</a>
      </nav>

      <div className="flex gap-5 items-center">
        {/* Le damos función al botón de buscar */}
        <button 
          onClick={() => setIsSearchOpen(true)} 
          className="hover:text-neutral-500 transition-colors hidden md:block"
        >
          <Search size={20} strokeWidth={2} />
        </button>
        
        <button onClick={() => setIsCartOpen(true)} className="relative hover:text-neutral-500 transition-colors">
          <ShoppingBag size={20} strokeWidth={2} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartItems.length}
            </span>
          )}
        </button>
        <button className="md:hidden"><Menu size={24} /></button>
      </div>
    </header>
  );
}