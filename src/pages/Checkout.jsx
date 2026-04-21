import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

// 1. DEFINIMOS EL ESQUEMA DE VALIDACIÓN CON ZOD
const checkoutSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  address: z.string().min(5, "La dirección es muy corta"),
  city: z.string().min(2, "Ingresa una ciudad válida"),
  cardNumber: z.string().regex(/^\d{16}$/, "La tarjeta debe tener 16 números sin espacios"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Usa el formato MM/AA"),
  cvc: z.string().regex(/^\d{3,4}$/, "El CVC debe tener 3 o 4 números"),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, showToast } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. CONFIGURAMOS REACT HOOK FORM
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur" // Valida cuando el usuario sale del input
  });

  // Calculamos los totales
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Si el carrito está vacío, no tiene sentido estar en el checkout
    if (cartItems.length === 0 && !isProcessing) {
      navigate('/');
    }
  }, [cartItems, navigate, isProcessing]);

  // 3. FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO VÁLIDO
  const onSubmit = (data) => {
    setIsProcessing(true);
    
    // Simulamos una llamada a un backend o pasarela de pago
    setTimeout(() => {
      clearCart();
      showToast("¡Pago exitoso! Recibirás un email con los detalles.", "success");
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 font-sans text-neutral-900">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="lg:col-span-7 bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-neutral-100">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>

          <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Finalizar Compra</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Sección: Datos de Contacto */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                1. Información de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input 
                    {...register("fullName")} 
                    placeholder="Nombre Completo" 
                    className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors ${errors.fullName ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-medium mt-2">{errors.fullName.message}</p>}
                </div>
                <div>
                  <input 
                    {...register("email")} 
                    placeholder="Correo Electrónico" 
                    type="email"
                    className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs font-medium mt-2">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Sección: Envío */}
            <div>
              <h2 className="text-lg font-bold mb-4 mt-8 flex items-center gap-2">
                2. Dirección de Envío
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input 
                    {...register("address")} 
                    placeholder="Dirección (Calle, número, departamento)" 
                    className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors ${errors.address ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs font-medium mt-2">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      {...register("city")} 
                      placeholder="Ciudad" 
                      className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors ${errors.city ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                    />
                    {errors.city && <p className="text-red-500 text-xs font-medium mt-2">{errors.city.message}</p>}
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 cursor-not-allowed">
                    San Juan, Argentina
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Pago */}
            <div className="pb-4">
              <h2 className="text-lg font-bold mb-4 mt-8 flex items-center gap-2">
                3. Pago Seguro <Lock size={16} className="text-green-600" />
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input 
                    {...register("cardNumber")} 
                    placeholder="Número de Tarjeta (16 dígitos)" 
                    maxLength={16}
                    className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors tracking-widest ${errors.cardNumber ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs font-medium mt-2">{errors.cardNumber.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      {...register("expiry")} 
                      placeholder="MM/AA" 
                      maxLength={5}
                      className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors ${errors.expiry ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                    />
                    {errors.expiry && <p className="text-red-500 text-xs font-medium mt-2">{errors.expiry.message}</p>}
                  </div>
                  <div>
                    <input 
                      {...register("cvc")} 
                      placeholder="CVC" 
                      maxLength={4}
                      className={`w-full p-4 border rounded-xl bg-neutral-50 outline-none transition-colors ${errors.cvc ? 'border-red-500 focus:border-red-500 bg-red-50/50' : 'border-neutral-200 focus:border-black'}`}
                    />
                    {errors.cvc && <p className="text-red-500 text-xs font-medium mt-2">{errors.cvc.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-5 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isProcessing ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? 'Procesando Pago...' : `Pagar $${total.toFixed(2)}`}
            </button>
            <p className="text-center text-xs text-neutral-400 font-medium flex items-center justify-center gap-1 mt-4">
              <ShieldCheck size={14} /> Tus datos están encriptados y seguros
            </p>
          </form>
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE LA ORDEN */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 sticky top-32">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6">Resumen del Pedido</h2>
            
            <div className="flex flex-col gap-6 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 h-20 bg-neutral-100 rounded-xl flex items-center justify-center p-2 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {item.quantity || 1}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-sm uppercase leading-tight">{item.name}</h3>
                    <p className="text-neutral-500 text-xs mt-1">Talla: {item.selectedSize}</p>
                    <p className="font-bold mt-1">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-6 space-y-4">
              <div className="flex justify-between text-neutral-500 text-sm">
                <span>Subtotal</span>
                <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-sm">
                <span>Envío estimado</span>
                <span className="text-black font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-lg font-black uppercase">Total</span>
                <span className="text-3xl font-black">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}