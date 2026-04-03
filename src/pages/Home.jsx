import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, RefreshCcw, Mail } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);

  const heroTextRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroDescRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    // 1. Animación del Hero
    const tl = gsap.timeline();
    tl.fromTo(heroTextRef.current, 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    )
    .fromTo(heroDescRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.5" 
    )
    .fromTo(heroImgRef.current,
      { x: 50, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
      "-=0.8"
    );

    // 2. Efecto de flotación
    gsap.to(heroImgRef.current, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2
    });

    // 3. Cinta Infinita (Marquee)
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1,
    });

    // 4. Animaciones de Scroll en cascada
    gsap.fromTo(".product-card",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".products-grid", start: "top 85%" }
      }
    );

    gsap.fromTo(".category-card",
      { scale: 0.95, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: "#categorias", start: "top 80%" }
      }
    );

    gsap.fromTo(".collection-card",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: "#colecciones", start: "top 85%" }
      }
    );

    // 5. Animación para la nueva sección Lifestyle
    gsap.fromTo(".lifestyle-content",
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: "#lifestyle-section", start: "top 70%" }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="bg-white text-neutral-900 font-sans selection:bg-black selection:text-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <main className="flex flex-col md:flex-row items-center justify-between px-8 py-12 md:px-24 md:py-24 max-w-7xl mx-auto min-h-[85vh]">
        <div className="md:w-1/2 space-y-8 z-10">
          <div className="overflow-hidden">
            <h1 ref={heroTextRef} className="text-[5rem] md:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter">
              Just <br /> Do It.
            </h1>
          </div>
          <div ref={heroDescRef}>
            <p className="text-lg text-neutral-500 max-w-md font-light mb-8 leading-relaxed">
              Descubre la nueva colección. Diseño impecable, rendimiento al máximo y un estilo inconfundible para dominar tu día a día.
            </p>
            <div className="flex gap-4 items-center">
              <Link to="/catalogo" className="group bg-black text-white px-8 py-4 rounded-full text-sm font-bold flex items-center gap-3 hover:bg-neutral-800 transition-all active:scale-95 shadow-xl shadow-black/20">
                Explorar Colección <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center relative">
          <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-neutral-100 rounded-full -z-10 mix-blend-multiply opacity-50 blur-3xl"></div>
          <img 
            ref={heroImgRef}
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Zapatilla Nike Minimalista" 
            className="w-[90%] md:w-full object-cover drop-shadow-2xl"
          />
        </div>
      </main>

      {/* --- CINTA INFINITA (MARQUEE) --- */}
      <div className="w-full bg-black text-white py-4 overflow-hidden flex items-center border-y border-neutral-800">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-12 text-sm font-bold uppercase tracking-[0.2em]">
          <span>Nuevos Lanzamientos</span> <span>•</span>
          <span>Envíos Gratis a todo el país</span> <span>•</span>
          <span>Descuento para estudiantes</span> <span>•</span>
          <span>Nuevos Lanzamientos</span> <span>•</span>
          <span>Envíos Gratis a todo el país</span> <span>•</span>
          <span>Descuento para estudiantes</span> <span>•</span>
          <span>Nuevos Lanzamientos</span> <span>•</span>
          <span>Envíos Gratis a todo el país</span> <span>•</span>
          <span>Descuento para estudiantes</span> <span>•</span>
        </div>
      </div>

      {/* --- FRANJA DE BENEFICIOS --- */}
      <section className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="flex flex-col items-center gap-3 pt-8 md:pt-0">
              <Truck size={32} strokeWidth={1.5} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Envío Gratuito</h3>
              <p className="text-xs text-neutral-500">En todas las compras superiores a $150</p>
            </div>
            <div className="flex flex-col items-center gap-3 pt-8 md:pt-0">
              <RefreshCcw size={32} strokeWidth={1.5} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Devoluciones</h3>
              <p className="text-xs text-neutral-500">Tienes 30 días para devolver tu pedido</p>
            </div>
            <div className="flex flex-col items-center gap-3 pt-8 md:pt-0">
              <ShieldCheck size={32} strokeWidth={1.5} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Pago Seguro</h3>
              <p className="text-xs text-neutral-500">Transacciones seguras procesadas con Stripe</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS --- */}
      <section className="px-8 py-24 md:px-24 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight">Lo Mejor <br/> De La Semana</h2>
          <Link to="/catalogo" className="hidden md:flex items-center gap-2 font-bold hover:text-neutral-500 transition-colors">
            Ver todo <ArrowRight size={20} />
          </Link>
        </div>

        <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="product-card group cursor-pointer">
              <div className="bg-neutral-100 aspect-square mb-6 overflow-hidden rounded-2xl relative transition-all duration-500 group-hover:shadow-xl">
                <Link to={`/producto/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:scale-110 group-hover:grayscale-0 transition-transform duration-700 ease-out"
                  />
                </Link>
                <button 
                  onClick={() => addToCart({ ...product, selectedSize: 'US 9' })} 
                  className="absolute bottom-6 right-6 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white shadow-lg"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
              <Link to={`/producto/${product.id}`} className="block px-2">
                <h3 className="font-bold text-xl mb-1">{product.name}</h3>
                <p className="text-neutral-500 text-sm mb-2">{product.category}</p>
                <p className="font-black text-lg">${product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- CATEGORÍAS: HOMBRE Y MUJER --- */}
      <section id="categorias" className="px-8 pb-24 md:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/catalogo" className="category-card relative h-[600px] overflow-hidden rounded-[2rem] group cursor-pointer block">
            <img 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" 
              alt="Categoría Hombre" 
              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500"></div>
            <div className="absolute bottom-12 left-12">
              <h3 className="text-white text-5xl font-black uppercase mb-6 tracking-tight group-hover:translate-x-2 transition-transform duration-500">Hombre</h3>
              <span className="bg-white text-black px-8 py-4 rounded-full text-sm font-bold group-hover:bg-neutral-200 transition-all inline-block">
                Explorar
              </span>
            </div>
          </Link>

          <Link to="/catalogo" className="category-card relative h-[600px] overflow-hidden rounded-[2rem] group cursor-pointer block">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
              alt="Categoría Mujer" 
              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500"></div>
            <div className="absolute bottom-12 left-12">
              <h3 className="text-white text-5xl font-black uppercase mb-6 tracking-tight group-hover:translate-x-2 transition-transform duration-500">Mujer</h3>
              <span className="bg-white text-black px-8 py-4 rounded-full text-sm font-bold group-hover:bg-neutral-200 transition-all inline-block">
                Explorar
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* --- COLECCIONES (Imágenes con altura fija y alineadas) --- */}
      <section id="colecciones" className="px-8 pb-24 md:px-24 max-w-7xl mx-auto border-t border-neutral-100 pt-24">
        <h2 className="text-4xl font-black uppercase tracking-tight mb-12 text-center">Líneas Icónicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/catalogo" className="collection-card bg-neutral-50 p-8 rounded-[2rem] flex flex-col items-center text-center hover:bg-neutral-100 transition-colors h-full">
             <h3 className="text-2xl font-black uppercase mb-2">Air Max</h3>
             <p className="text-sm text-neutral-500 mb-8">La cámara de aire que cambió el juego.</p>
             {/* Agregamos h-56 object-contain para fijar el tamaño exacto sin deformar */}
             <img src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=600&q=80" alt="Air Max" className="w-full h-56 object-contain mix-blend-multiply drop-shadow-xl hover:scale-110 transition-transform duration-500 mt-auto" />
          </Link>
          <Link to="/catalogo" className="collection-card bg-neutral-50 p-8 rounded-[2rem] flex flex-col items-center text-center hover:bg-neutral-100 transition-colors mt-0 md:mt-12 h-full">
             <h3 className="text-2xl font-black uppercase mb-2">Jordan Retro</h3>
             <p className="text-sm text-neutral-500 mb-8">El legado de la grandeza en la cancha.</p>
             <img src="https://images.unsplash.com/photo-1608667508764-33cf0726b13a?auto=format&fit=crop&w=600&q=80" alt="Jordan" className="w-full h-56 object-contain mix-blend-multiply drop-shadow-xl hover:scale-110 transition-transform duration-500 mt-auto" />
          </Link>
          <Link to="/catalogo" className="collection-card bg-neutral-50 p-8 rounded-[2rem] flex flex-col items-center text-center hover:bg-neutral-100 transition-colors h-full">
             <h3 className="text-2xl font-black uppercase mb-2">Running</h3>
             <p className="text-sm text-neutral-500 mb-8">Supera tus límites en cada kilómetro.</p>
             <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Running" className="w-full h-56 object-contain mix-blend-multiply drop-shadow-xl hover:scale-110 transition-transform duration-500 mt-auto" />
          </Link>
        </div>
      </section>

      {/* --- SECCIÓN LIFESTYLE CON EFECTO PARALLAX --- */}
      {/* Añadido bg-fixed, bg-center y bg-cover para lograr el parallax visual de manera nativa */}
      <section 
        id="lifestyle-section" 
        className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="lifestyle-content relative z-10 text-center text-white px-8 max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Eleva tu juego</h2>
          <p className="text-lg md:text-xl text-neutral-300 font-light mb-10 leading-relaxed">
            No se trata solo del calzado. Se trata de lo que haces con él. Encuentra la equipación perfecta para superar tus propios límites todos los días.
          </p>
          <Link to="/catalogo" className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors inline-block active:scale-95 shadow-2xl">
            Descubrir Colección
          </Link>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="bg-black text-white py-24 px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
           <Mail size={48} className="mx-auto mb-6 opacity-80" strokeWidth={1} />
           <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Únete al Club Nike</h2>
           <p className="text-neutral-400 font-light text-lg">Recibe noticias, lanzamientos exclusivos y beneficios para tu primera compra.</p>
           <form className="flex flex-col sm:flex-row gap-4 justify-center mt-8" onSubmit={(e) => e.preventDefault()}>
             <input type="email" placeholder="Tu correo electrónico" className="px-6 py-4 rounded-full text-black outline-none sm:w-96 focus:ring-2 focus:ring-neutral-500" />
             <button className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">Suscribirme</button>
           </form>
        </div>
      </section>

      {/* --- FOOTER RESTAURADO --- */}
      <footer className="bg-neutral-50 border-t border-neutral-100 px-8 py-20 md:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-lg">Buscar Tienda</h4>
            <ul className="space-y-3 font-medium">
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Hazte miembro</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Descuento para estudiantes</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-lg">Ayuda</h4>
            <ul className="space-y-3 font-medium">
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Estado del pedido</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Envíos y entregas</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Devoluciones</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-widest text-lg">Acerca de Nike</h4>
            <ul className="space-y-3 font-medium">
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Noticias</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>

          <div className="md:text-right text-xs text-neutral-400 mt-auto flex flex-col md:items-end gap-4">
            <div className="text-3xl font-black text-neutral-200">NIKE</div>
            <p>&copy; 2026 Nike, Inc. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}