import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart } = useCartStore();

  return (
    <>
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-neutral-100">
          <h2 className="text-xl font-black uppercase">Tu Carrito</h2>
          <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="p-6 flex flex-col gap-6 h-[calc(100vh-200px)] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-neutral-400 text-center mt-10 font-light">No hay productos aún.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex gap-4 group">
                <img src={item.image} className="w-20 h-20 object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" />
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
          <button className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-neutral-800 transition-all">
            Finalizar Compra
          </button>
        </div>
      </div>
      {isCartOpen && <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" onClick={() => setIsCartOpen(false)} />}
    </>
  );
}