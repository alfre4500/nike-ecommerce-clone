import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';

// Registramos el plugin de scroll
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const addToCart = useCartStore((state) => state.addToCart);

  const heroTextRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroDescRef = useRef(null);

  useEffect(() => {
    // 1. Animación del Hero (Al cargar la página)
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

    // 2. Animaciones de Scroll
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

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="bg-white text-neutral-900 font-sans selection:bg-black selection:text-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <main className="flex flex-col md:flex-row items-center justify-between px-8 py-16 md:px-24 md:py-32 max-w-7xl mx-auto border-b border-neutral-100">
        <div className="md:w-1/2 space-y-8 z-10">
          <div className="overflow-hidden">
            <h1 ref={heroTextRef} className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight">
              Just <br /> Do It.
            </h1>
          </div>
          <div ref={heroDescRef}>
            <p className="text-lg text-neutral-600 max-w-md font-light mb-8">
              Descubre la nueva colección. Diseño sobrio, rendimiento al máximo y un estilo impecable para tu día a día.
            </p>
            <div className="flex gap-4">
              <button className="bg-black text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-neutral-800 transition-all">
                Comprar ahora
              </button>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center relative" ref={heroImgRef}>
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-neutral-100 rounded-full -z-10 mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Zapatilla Nike Minimalista" 
            className="w-[80%] md:w-full object-cover rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </main>

      {/* --- PRODUCTOS DESTACADOS --- */}
      <section className="px-8 py-24 md:px-24 max-w-7xl mx-auto border-b border-neutral-100">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tight">Lo Mejor <br/> De La Semana</h2>
        </div>

        <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="product-card group cursor-pointer">
              <div className="bg-neutral-100 aspect-square mb-4 overflow-hidden rounded-xl relative">
                <Link to={`/producto/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                  />
                </Link>
                <button 
                  onClick={() => addToCart({ ...product, selectedSize: 'US 9' })} 
                  className="absolute bottom-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-200 shadow-md"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
              <Link to={`/producto/${product.id}`} className="block">
                <h3 className="font-bold text-lg hover:text-neutral-600 transition-colors">{product.name}</h3>
                <p className="text-neutral-500 text-sm">{product.category}</p>
                <p className="font-medium mt-2">${product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- CATEGORÍAS: HOMBRE Y MUJER --- */}
      <section id="categorias" className="px-8 py-24 md:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="category-card relative h-[600px] overflow-hidden rounded-2xl group cursor-pointer">
            {/* Imagen Actualizada de Hombre */}
            <img 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" 
              alt="Categoría Hombre" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-10 left-10">
              <h3 className="text-white text-4xl font-black uppercase mb-4 tracking-tight">Hombre</h3>
              <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-neutral-200 transition-all">
                Comprar
              </button>
            </div>
          </div>

          <div className="category-card relative h-[600px] overflow-hidden rounded-2xl group cursor-pointer">
             {/* Imagen Actualizada de Mujer */}
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
              alt="Categoría Mujer" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-10 left-10">
              <h3 className="text-white text-4xl font-black uppercase mb-4 tracking-tight">Mujer</h3>
              <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-neutral-200 transition-all">
                Comprar
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- COLECCIONES (Estilo Bento Box) --- */}
      <section id="colecciones" className="px-8 py-12 md:px-24 max-w-7xl mx-auto pb-24">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-12 text-center md:text-left">Colecciones<br/>Icónicas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="collection-card md:col-span-2 relative h-[400px] overflow-hidden rounded-2xl group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80" 
              alt="Air Max Collection" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700"></div>
            <div className="absolute bottom-8 left-8">
              <p className="text-white font-medium mb-1 drop-shadow-md">Estilo Urbano</p>
              <h3 className="text-white text-3xl font-black uppercase drop-shadow-md">Air Max Studio</h3>
            </div>
          </div>

          <div className="collection-card relative h-[400px] overflow-hidden rounded-2xl group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80" 
              alt="Running Collection" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700"></div>
            <div className="absolute bottom-8 left-8">
              <p className="text-white font-medium mb-1 drop-shadow-md">Máximo Rendimiento</p>
              <h3 className="text-white text-3xl font-black uppercase drop-shadow-md">Pro Running</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER RESTAURADO --- */}
      <footer className="bg-white border-t border-neutral-100 px-8 py-16 md:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Buscar una tienda</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Hazte miembro</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Descuento para estudiantes</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Estado del pedido</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Envíos y entregas</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Opciones de pago</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Acerca de Nike</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Noticias</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Carreras</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Inversores</a></li>
              <li><a href="#" className="text-neutral-500 hover:text-black transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>

          <div className="md:text-right text-xs text-neutral-400 mt-auto">
            <p>&copy; 2026 Nike, Inc. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}