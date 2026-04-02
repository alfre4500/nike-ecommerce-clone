import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Zap, Trophy, Heart } from 'lucide-react';
import { products } from '../data/products';

export default function CategoryLanding({ category, heroTitle, heroImg, subtitle }) {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  // Filtramos solo 4 destacados para esta página
  const featuredProducts = products
    .filter(p => p.category.includes(category))
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline();
    
    tl.fromTo(heroRef.current, 
      { opacity: 0, scale: 1.1 }, 
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    gsap.fromTo(".info-card", 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.5 }
    );
  }, [category]);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION DEDICADO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <img src={heroImg} alt={category} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 italic">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
          <Link to={`/catalogo?filter=${category}`} className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95 inline-block">
            Ver Todo {category}
          </Link>
        </div>
      </section>

      {/* SECCIÓN DE "VALORES" O COLECCIONES */}
      <section className="py-24 px-8 md:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="info-card space-y-4">
          <div className="bg-neutral-100 w-16 h-16 rounded-2xl flex items-center justify-center">
            <Zap className="text-black" />
          </div>
          <h3 className="text-2xl font-black uppercase">Innovación</h3>
          <p className="text-neutral-500 font-light">Tecnología de punta diseñada para superar tus propios límites en cada entrenamiento.</p>
        </div>
        <div className="info-card space-y-4">
          <div className="bg-neutral-100 w-16 h-16 rounded-2xl flex items-center justify-center">
            <Trophy className="text-black" />
          </div>
          <h3 className="text-2xl font-black uppercase">Rendimiento</h3>
          <p className="text-neutral-500 font-light">Probado por atletas de élite para garantizar la máxima durabilidad y respuesta.</p>
        </div>
        <div className="info-card space-y-4">
          <div className="bg-neutral-100 w-16 h-16 rounded-2xl flex items-center justify-center">
            <Heart className="text-black" />
          </div>
          <h3 className="text-2xl font-black uppercase">Estilo Diario</h3>
          <p className="text-neutral-500 font-light">La fusión perfecta entre el legado deportivo y la moda urbana contemporánea.</p>
        </div>
      </section>

      {/* MINI GALERÍA DE DESTACADOS */}
      <section className="py-24 bg-neutral-50 px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tight">Selección Destacada</h2>
            <Link to={`/catalogo?filter=${category}`} className="font-bold flex items-center gap-2 hover:underline">
              Explorar más <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <Link key={product.id} to={`/producto/${product.id}`} className="group">
                <div className="bg-white aspect-square rounded-2xl overflow-hidden mb-4 border border-neutral-100 shadow-sm transition-shadow group-hover:shadow-xl">
                  <img src={product.image} className="w-full h-full object-cover mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h4 className="font-bold uppercase tracking-tight">{product.name}</h4>
                <p className="text-neutral-500 text-sm italic">${product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}