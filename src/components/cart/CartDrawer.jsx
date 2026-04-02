import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react'; // <--- AGREGAMOS ShoppingBag AQUÍ
import { useCartStore } from '../../store/useCartStore';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-neutral-100">
          <h2 className="text-xl font-black uppercase">Tu Carrito</h2>
          <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="p-6 flex flex-col gap-6 h-[calc(100vh-200px)] overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 opacity-40">
               {/* Ahora que está importado, ya no dará error */}
               <ShoppingBag size={48} className="mb-4" /> 
               <p className="text-center font-light">No hay productos aún.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex gap-4 group">
                <img src={item.image} className="w-20 h-20 object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" alt={item.name} />
                <div className="flex-1">
                  <h3 className="font-bold text-sm uppercase">{item.name}</h3>
                  <p className="text-neutral-500 text-xs mt-1">${item.price}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 mt-2 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 w-full p-6 bg-white border-t border-neutral-100">
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className={`w-full py-4 rounded-full font-bold transition-all uppercase tracking-widest ${
              cartItems.length === 0 
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-neutral-800 active:scale-95'
            }`}
          >
            Pasar por caja
          </button>
        </div>
      </div>
      {isCartOpen && <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" onClick={() => setIsCartOpen(false)} />}
    </>
  );
}