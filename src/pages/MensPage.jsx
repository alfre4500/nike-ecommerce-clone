import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ArrowRight, Zap, Target, Flame } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function MensPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const marqueeRef = useRef(null);

  // Filtramos solo los productos de Hombre
  const mensProducts = products.filter(p => p.category === 'Hombre');
  const featuredMens = mensProducts.slice(0, 4); // Tomamos los primeros 4 para destacar

  useEffect(() => {
    // Scroll a tope de página al cargar
    window.scrollTo(0, 0);

    // Animación de entrada de la cabecera
    gsap.fromTo(".hero-text-men",
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
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?auto=format&fit=crop&w=1920&q=80')" }}
      >
        {/* Capa oscura para que el texto resalte */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
          <span className="hero-text-men bg-white text-black px-4 py-1 text-xs font-black uppercase tracking-widest mb-6">
            Colección Hombre
          </span>
          <h1 className="hero-text-men text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Potencia <br /> Pura.
          </h1>
          <p className="hero-text-men text-lg md:text-xl text-neutral-300 font-light max-w-2xl">
            Domina la cancha y la calle con lo último en ingeniería deportiva. Rendimiento inquebrantable, estilo insuperable.
          </p>
        </div>
      </section>

      {/* --- CINTA INFINITA (MARQUEE) --- */}
      <div className="w-full bg-neutral-900 text-white py-4 overflow-hidden flex items-center">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 text-sm font-black uppercase tracking-widest">
          <span>Streetwear</span> <Zap size={16} />
          <span>Basketball</span> <Flame size={16} />
          <span>Running</span> <Target size={16} />
          <span>Entrenamiento</span> <Zap size={16} />
          <span>Streetwear</span> <Flame size={16} />
          <span>Basketball</span> <Target size={16} />
          <span>Running</span> <Zap size={16} />
          <span>Entrenamiento</span> <Flame size={16} />
          <span>Streetwear</span> <Target size={16} />
        </div>
      </div>

      {/* --- BENTO GRID: ESTILOS DE HOMBRE --- */}
      <section className="max-w-7xl mx-auto px-8 py-24 bento-trigger">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight">Elige tu <br/> Camino</h2>
          <p className="text-neutral-500 max-w-sm text-right hidden md:block">
            Equipamiento diseñado específicamente para tus metas. Ya sea en el asfalto o en el gimnasio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]">
          {/* Tarjeta Lifestyle / Street */}
          <div className="bento-card relative overflow-hidden rounded-[2rem] group cursor-pointer bg-neutral-100">
            <img 
              src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80" 
              alt="Estilo Urbano Hombre" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-2">Streetwear</h3>
              <p className="text-neutral-300 text-sm mb-4">La cultura sneaker en su máxima expresión.</p>
              <Link to="/catalogo" className="border-b-2 border-white pb-1 font-bold hover:text-neutral-300 hover:border-neutral-300 transition-colors">
                Ver Siluetas Clásicas
              </Link>
            </div>
          </div>

          {/* Tarjeta Performance / Deporte */}
          <div className="bento-card relative overflow-hidden rounded-[2rem] group cursor-pointer bg-black">
            <img 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80" 
              alt="Performance Hombre" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-2">Performance</h3>
              <p className="text-neutral-300 text-sm mb-4">Rompe récords. Supera tus límites.</p>
              <Link to="/catalogo" className="border-b-2 border-white pb-1 font-bold hover:text-neutral-300 hover:border-neutral-300 transition-colors">
                Ver Equipamiento Técnico
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS HOMBRES --- */}
      <section className="px-8 pb-24 max-w-7xl mx-auto fade-up-trigger border-t border-neutral-100 pt-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight fade-up-element">Armamento <br/> Pesado</h2>
          <Link to="/catalogo" className="hidden md:flex items-center gap-2 font-bold hover:text-neutral-500 transition-colors fade-up-element">
            Ver todo el calzado <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredMens.map((product) => (
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
                  onClick={() => addToCart({ ...product, selectedSize: 'US 10' })} 
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
          <div className="mb-10 md:mb-0 md:pr-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">No te detengas.</h2>
            <p className="text-neutral-600 font-light text-lg mb-8 max-w-md">
              Aprovecha el envío gratuito en todas las compras de calzado de hombre superiores a $150. Eleva tu nivel hoy.
            </p>
            <Link to="/catalogo" className="inline-flex bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors active:scale-95 shadow-xl">
              Comprar Todo
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80" 
              alt="Sneakers promo" 
              className="w-full mix-blend-multiply object-contain drop-shadow-2xl hover:-translate-y-4 transition-transform duration-500" 
            />
          </div>
        </div>
      </section>

    </div>
  );
}