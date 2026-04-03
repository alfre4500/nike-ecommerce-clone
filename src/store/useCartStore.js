import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      isCartOpen: false,
      toast: { message: '', type: 'success', isVisible: false },
      isSearchOpen: false,

      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      
      addToCart: (product) => set((state) => {
        // 1. Buscamos si ya existe el mismo producto con EL MISMO TALLE
        const existingItemIndex = state.cartItems.findIndex(
          (item) => item.id === product.id && item.selectedSize === product.selectedSize
        );

        if (existingItemIndex !== -1) {
          // 2. Si existe, copiamos el carrito y le sumamos 1 a la cantidad de ese producto
          const updatedCartItems = [...state.cartItems];
          // Aseguramos que tenga cantidad previa, si no la iniciamos en 1
          updatedCartItems[existingItemIndex].quantity = (updatedCartItems[existingItemIndex].quantity || 1) + 1;
          
          return { 
            cartItems: updatedCartItems,
            isCartOpen: true 
          };
        } else {
          // 3. Si no existe, lo agregamos al carrito con la propiedad quantity: 1
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }],
            isCartOpen: true 
          };
        }
      }),
      
      removeFromCart: (id) => set((state) => ({
        // Filtramos para eliminar el producto
        cartItems: state.cartItems.filter((item) => item.id !== id)
      })),

      // 4. Agregamos la función para limpiar el carrito después de comprar
      clearCart: () => set({ cartItems: [] }),

      showToast: (message, type = 'success') => {
        set({ toast: { message, type, isVisible: true } });
        
        setTimeout(() => {
          set((state) => ({ toast: { ...state.toast, isVisible: false } }));
        }, 3000);
      },
    }),
    {
      name: 'nike-cart-storage',
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);