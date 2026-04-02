import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';
import useImageColor from '../hooks/useImageColor'; // 1. IMPORTAMOS EL HOOK

export default function ProductDetails() {
  const { id } = useParams(); 
  const [selectedSize, setSelectedSize] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart); 
  const showToast = useCartStore((state) => state.showToast); 
  
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const backgroundRef = useRef(null); // 2. REFERENCIA PARA EL FONDO DINÁMICO

  const product = products.find(p => p.id === parseInt(id));
  
  // 3. OBTENEMOS EL COLOR DINÁMICO DE LA IMAGEN
  const dynamicColor = useImageColor(product?.image);

  // Animaciones y efectos
  useEffect(() => {
    window.scrollTo(0, 0); 
    
    // 4. ANIMAMOS SUAVEMENTE EL CAMBIO DE COLOR DEL FONDO CON GSAP
    if (product && dynamicColor) {
      gsap.to(backgroundRef.current, {
        backgroundColor: dynamicColor,
        duration: 1.2, // Una transición larga y suave
        ease: "power2.out"
      });
    }

    const tl = gsap.timeline();
    tl.fromTo(imageRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    ).fromTo(contentRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
  }, [id, dynamicColor, product]); // Dependencia del color dinámico

  const sizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <h1 className="text-2xl font-bold">Producto no encontrado.</h1>
        <Link to="/" className="ml-4 underline hover:text-neutral-500">Volver</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
      
      {/* Barra de navegación superior con desenfoque para que se vea sobre el color */}
      <nav className="p-8 flex justify-between items-center absolute w-full z-10">
        <Link to="/" className="flex items-center gap-2 font-medium hover:text-neutral-500 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full">
          <ArrowLeft size={20} /> Volver a la tienda
        </Link>
        <div className="text-2xl font-black tracking-tighter">NIKE</div>
      </nav>

      {/* Contenedor Principal Dividido */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-0">
        
        {/* Mitad Izquierda: Galería */}
        {/* 5. ASIGNAMOS LA REFERENCIA DEL FONDO AQUÍ */}
     <div className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-24 min-h-[60vh] bg-neutral-100 overflow-hidden">
          
          {/* 1. SEPARAMOS EL FONDO DINÁMICO EN UNA CAPA CON OPACIDAD DEL 20% */}
          <div 
            ref={backgroundRef} 
            className="absolute inset-0 opacity-20"
          ></div>

          {/* 2. LA IMAGEN VA POR ENCIMA (z-10) */}
          <img 
            ref={imageRef}
            src={product.image} 
            alt={product.name} 
            className="w-full max-w-xl object-contain drop-shadow-2xl mix-blend-multiply relative z-10"
          />
        </div>

        {/* Mitad Derecha: Información y Compra */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-24" ref={contentRef}>
          <p className="text-neutral-500 font-medium mb-2">{product.category}</p>
          <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tight mb-4 leading-none">
            {product.name}
          </h1>
          <p className="text-2xl font-medium mb-8">${product.price.toFixed(2)}</p>
          
          <p className="text-neutral-600 font-light mb-10 leading-relaxed max-w-lg">
            {product.description}
          </p>

          {/* Selector de Talles */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Selecciona tu talla</h3>
              <button className="text-neutral-500 text-sm hover:text-black transition-colors">Guía de tallas</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 border rounded-md font-medium transition-all ${
                    selectedSize === size 
                      ? 'border-black bg-black text-white shadow-md scale-[1.02]' 
                      : 'border-neutral-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if (!selectedSize) {
                  showToast("Por favor, selecciona una talla primero.", "error");
                  return;
                }
                addToCart({ ...product, selectedSize }); 
                showToast("Agregado al carrito exitosamente.", "success");
              }}
              className="flex-1 bg-black text-white py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors active:scale-95"
            >
              <ShoppingBag size={20} /> Agregar al Carrito
            </button>
            <button className="p-5 border border-neutral-300 rounded-full hover:border-black transition-colors">
              <Heart size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}