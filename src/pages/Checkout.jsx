import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

// Importaciones de Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Inicializamos Stripe fuera del componente para no recrearlo en cada render.
// Nota: Aquí debes poner tu CLAVE PÚBLICA (Publishable key) de prueba de Stripe.
const stripePromise = loadStripe('pk_test_51S2zKjRwcBA4xGNyEYtdDAO65XKgferI6b0GRClTlir2uOK6XtiGkJjXliNXN3AwdUuTJkc66NneBzUumjaDA6jE00lrCuMsDe');

// Componente interno del Formulario para poder usar los hooks de Stripe
const CheckoutForm = ({ total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe aún no ha cargado
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);

    // Simulamos la creación del método de pago con Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: e.target.name.value,
        email: e.target.email.value,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else {
      // Si todo sale bien, simulamos un pequeño delay de red antes de mostrar el éxito
      console.log('Pago exitoso, ID:', paymentMethod.id);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1000);
    }
  };

  // Estilos personalizados para que el input de Stripe haga match con tu diseño
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#000',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        '::placeholder': { color: '#a3a3a3' },
        iconColor: '#000',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nombre</label>
          <input required name="name" type="text" placeholder="Tu nombre" className="border-b-2 border-neutral-100 py-3 focus:border-black outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Apellido</label>
          <input required name="lastName" type="text" placeholder="Tu apellido" className="border-b-2 border-neutral-100 py-3 focus:border-black outline-none transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Correo Electrónico</label>
        <input required name="email" type="email" placeholder="email@ejemplo.com" className="border-b-2 border-neutral-100 py-3 focus:border-black outline-none transition-colors" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Dirección de Envío</label>
        <input required name="address" type="text" placeholder="Calle y número" className="border-b-2 border-neutral-100 py-3 focus:border-black outline-none transition-colors" />
      </div>

      <div className="pt-10">
        <h3 className="font-black uppercase text-sm mb-6">Datos de Tarjeta</h3>
        {/* Contenedor del input de Stripe */}
        <div className="p-4 border-b-2 border-neutral-100 focus-within:border-black transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
        {errorMessage && <p className="text-red-500 text-xs mt-2 font-medium">{errorMessage}</p>}
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-black text-white py-5 rounded-full font-black uppercase tracking-widest mt-10 hover:bg-neutral-800 transition-colors active:scale-[0.98] disabled:bg-neutral-400 flex justify-center items-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Procesando...
          </>
        ) : (
          `Realizar Pedido — $${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

// Componente Principal
export default function Checkout() {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isFinished, setIsFinished] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = 15;
  const total = subtotal + envio;

  const handlePaymentSuccess = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#888888']
    });

    setIsFinished(true);
    
    setTimeout(() => {
      clearCart();
    }, 1000);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">¡Pedido Confirmado!</h1>
        <p className="text-neutral-500 max-w-md mb-10 font-light">
          Gracias por tu compra. Hemos enviado los detalles de tu pedido a tu correo electrónico.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-8 md:px-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
        
        {/* FORMULARIO */}
        <div className="flex-1">
          <Link to="/catalogo" className="flex items-center gap-2 text-sm font-bold mb-8 hover:text-neutral-500 transition-colors">
            <ArrowLeft size={16} /> Volver al catálogo
          </Link>
          
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-10">Finalizar Compra</h1>
          
          {/* Envolvemos nuestro formulario en el Provider de Stripe */}
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} onSuccess={handlePaymentSuccess} />
          </Elements>
        </div>

        {/* RESUMEN */}
        <div className="lg:w-96 bg-neutral-50 p-10 rounded-[2.5rem] h-fit">
          <h3 className="font-black uppercase mb-8 tracking-tight">Resumen del pedido</h3>
          
          <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                <img src={item.image} className="w-16 h-16 object-cover rounded-lg bg-white mix-blend-multiply" alt="" />
                <div>
                  <p className="text-xs font-black uppercase leading-tight">{item.name}</p>
                  <p className="text-[10px] text-neutral-400">Talla: {item.selectedSize} | Cant: {item.quantity}</p>
                  <p className="text-xs font-bold mt-1">${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-3">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Envío</span>
              <span>${envio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-xl pt-3 border-t border-neutral-200">
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}