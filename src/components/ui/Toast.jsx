import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function Toast() {
  const { toast } = useCartStore();
  const toastRef = useRef(null);

  useEffect(() => {
    if (toast.isVisible) {
      // Aparece desde abajo
      gsap.to(toastRef.current, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
    } else {
      // Se esconde hacia abajo
      gsap.to(toastRef.current, { y: 100, opacity: 0, duration: 0.4, ease: "power3.in" });
    }
  }, [toast.isVisible]);

  return (
    <div 
      ref={toastRef}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl bg-black text-white translate-y-[100px] opacity-0"
    >
      {toast.type === 'error' ? (
        <AlertCircle className="text-red-400" size={20} />
      ) : (
        <CheckCircle2 className="text-white" size={20} />
      )}
      <span className="font-medium text-sm">{toast.message}</span>
    </div>
  );
}