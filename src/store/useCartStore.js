import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],
  isCartOpen: false,
  // Nuevo estado para la notificación
  toast: { message: '', type: 'success', isVisible: false },

  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),
  
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  
  addToCart: (product) => set((state) => ({
    cartItems: [...state.cartItems, product],
    isCartOpen: true 
  })),
  
  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.id !== id)
  })),

  // Función para disparar la notificación
  showToast: (message, type = 'success') => {
    set({ toast: { message, type, isVisible: true } });
    
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, isVisible: false } }));
    }, 3000);
  },
}));