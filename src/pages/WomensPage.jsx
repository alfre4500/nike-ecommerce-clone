import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ArrowRight, Sparkles, Activity, Flame } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function WomensPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const marqueeRef = useRef(null);

  // Filtramos solo los productos de Mujer
  const womensProducts = products.filter(p => p.category === 'Mujer');
  const featuredWomens = womensProducts.slice(0, 4);

  useEffect(() => {
    // Scroll a tope de página al cargar
    window.scrollTo(0, 0);

    // Animación de entrada de la cabecera
    gsap.fromTo(".hero-text-women",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
    );

    // Cinta Infinita (Marquee)
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1,
    });

    // Animaciones de scroll para los productos y banners
    gsap.fromTo(".fade-up-element",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".fade-up-trigger", start: "top 80%" }
      }
    );

    gsap.fromTo(".bento-card",
      { scale: 0.95, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: ".bento-trigger", start: "top 75%" }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="bg-white text-neutral-900 font-sans selection:bg-black selection:text-white pb-20">
      
      {/* --- HERO CON EFECTO PARALLAX --- */}
      <section 
        className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-fixed bg-center bg-cover mt-16"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
          <span className="hero-text-women bg-white text-black px-4 py-1 text-xs font-black uppercase tracking-widest mb-6">
            Colección Mujer
          </span>
          <h1 className="hero-text-women text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Estilo sin <br /> Límites.
          </h1>
          <p className="hero-text-women text-lg md:text-xl text-neutral-200 font-light max-w-2xl">
            Diseño icónico y comodidad absoluta para las que se atreven a ir más allá. Reescribe las reglas del juego.
          </p>
        </div>
      </section>

      {/* --- CINTA INFINITA (MARQUEE) --- */}
      <div className="w-full bg-black text-white py-4 overflow-hidden flex items-center">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 text-sm font-black uppercase tracking-widest">
          <span>Lifestyle</span> <Sparkles size={16} />
          <span>Running</span> <Flame size={16} />
          <span>Studio & Yoga</span> <Activity size={16} />
          <span>Entrenamiento</span> <Flame size={16} />
          <span>Lifestyle</span> <Sparkles size={16} />
          <span>Running</span> <Flame size={16} />
          <span>Studio & Yoga</span> <Activity size={16} />
          <span>Entrenamiento</span> <Flame size={16} />
          <span>Lifestyle</span> <Sparkles size={16} />
        </div>
      </div>

      {/* --- BENTO GRID: ESTILOS DE MUJER --- */}
      <section className="max-w-7xl mx-auto px-8 py-24 bento-trigger">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight">Crea Tu <br/> Propio Ritmo</h2>
          <p className="text-neutral-500 max-w-sm text-right hidden md:block">
            Siluetas versátiles que te acompañan desde tu primera reunión hasta tu última serie en el gimnasio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]">
          {/* Tarjeta Moda / Lifestyle */}
          <div className="bento-card relative overflow-hidden rounded-[2rem] group cursor-pointer bg-neutral-100">
            <img 
              src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1000&q=80" 
              alt="Estilo Urbano Mujer" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-2">Iconos Urbanos</h3>
              <p className="text-neutral-200 text-sm mb-4">La comodidad se encuentra con la alta moda.</p>
              <Link to="/catalogo" className="border-b-2 border-white pb-1 font-bold hover:text-neutral-300 hover:border-neutral-300 transition-colors">
                Explorar Sneakers
              </Link>
            </div>
          </div>

          {/* Tarjeta Running / Active */}
          <div className="bento-card relative overflow-hidden rounded-[2rem] group cursor-pointer bg-black">
            <img 
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80" 
              alt="Performance Mujer" 
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-2">Máximo Rendimiento</h3>
              <p className="text-neutral-300 text-sm mb-4">Soporte y amortiguación para cada kilómetro.</p>
              <Link to="/catalogo" className="border-b-2 border-white pb-1 font-bold hover:text-neutral-300 hover:border-neutral-300 transition-colors">
                Ver Equipamiento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS MUJERES --- */}
      <section className="px-8 pb-24 max-w-7xl mx-auto fade-up-trigger border-t border-neutral-100 pt-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight fade-up-element">Imprescindibles <br/> De Temporada</h2>
          <Link to="/catalogo" className="hidden md:flex items-center gap-2 font-bold hover:text-neutral-500 transition-colors fade-up-element">
            Ver todo el calzado <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredWomens.map((product) => (
            <div key={product.id} className="fade-up-element group cursor-pointer">
              <div className="bg-neutral-100 aspect-square mb-4 overflow-hidden rounded-2xl relative transition-all duration-500 group-hover:shadow-xl">
                <Link to={`/producto/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </Link>
                {/* Botón rápido de agregar */}
                <button 
                  onClick={() => addToCart({ ...product, selectedSize: 'US 7' })} 
                  className="absolute bottom-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white shadow-lg"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
              <Link to={`/producto/${product.id}`} className="block">
                <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">{product.name}</h3>
                <p className="text-neutral-500 text-sm">{product.category}</p>
                <p className="font-black mt-1">${product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- BANNER INFERIOR PROMOCIONAL --- */}
      <section className="max-w-7xl mx-auto px-8 fade-up-element">
        <div className="bg-neutral-100 rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="mb-10 md:mb-0 md:pr-12 md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Haz que suceda.</h2>
            <p className="text-neutral-600 font-light text-lg mb-8 max-w-md">
              Encuentra la inspiración que necesitas. Envío gratuito en todos los pedidos de la colección de mujer. 
            </p>
            <Link to="/catalogo" className="inline-flex bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors active:scale-95 shadow-xl">
              Explorar Catálogo
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80" 
              alt="Promoción Mujer" 
              className="w-full max-w-sm mix-blend-multiply object-contain drop-shadow-2xl hover:-translate-y-4 transition-transform duration-500" 
            />
          </div>
        </div>
      </section>

    </div>
  );
}