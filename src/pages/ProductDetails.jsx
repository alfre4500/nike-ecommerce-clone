import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Heart, ShoppingBag, Box } from 'lucide-react'; // Importamos el ícono Box
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';
import useImageColor from '../hooks/useImageColor';

// IMPORTACIONES PARA EL VISOR 3D
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei';

// COMPONENTE 3D DE EJEMPLO
// Cuando tengas tu modelo .glb, lo cargarás aquí usando el hook useGLTF de '@react-three/drei'
function ShoePlaceholder({ color }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh rotation={[0.2, -0.6, 0]}>
        {/* Usamos un bloque para simular el espacio del calzado por ahora */}
        <boxGeometry args={[1.5, 0.8, 3]} />
        <meshStandardMaterial color={color || "#222222"} roughness={0.1} metalness={0.2} />
      </mesh>
    </Float>
  );
}

export default function ProductDetails() {
  const { id } = useParams(); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [show3D, setShow3D] = useState(false); // NUEVO ESTADO PARA EL TOGGLE 3D

  const addToCart = useCartStore((state) => state.addToCart); 
  const showToast = useCartStore((state) => state.showToast); 
  
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const backgroundRef = useRef(null);
  const sizesRef = useRef([]);
  const buttonIconRef = useRef(null);

  const product = products.find(p => p.id === parseInt(id));
  const dynamicColor = useImageColor(product?.image);

  useEffect(() => {
    window.scrollTo(0, 0); 
    
    if (product && dynamicColor) {
      gsap.to(backgroundRef.current, {
        backgroundColor: dynamicColor,
        duration: 1.2,
        ease: "power2.out"
      });
    }

    const tl = gsap.timeline();
    
    // Solo animamos la imagen de entrada si estamos en la vista de foto
    if (!show3D && imageRef.current) {
      tl.fromTo(imageRef.current,
        { opacity: 0, scale: 0.8, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.7)" }
      );
    }
    
    tl.fromTo(contentRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      show3D ? 0 : "-=0.8"
    )
    .fromTo(sizesRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" },
      "-=0.4"
    );
  }, [id, dynamicColor, product, show3D]);

  const handleButtonMouseEnter = () => {
    gsap.to(buttonIconRef.current, { y: -3, scale: 1.1, duration: 0.2, ease: "power2.out" });
  };

  const handleButtonMouseLeave = () => {
    gsap.to(buttonIconRef.current, { y: 0, scale: 1, duration: 0.2, ease: "power2.in" });
  };

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
      
      <nav className="p-8 flex justify-between items-center absolute top-16 w-full z-10">
        <Link to="/" className="flex items-center gap-2 font-medium hover:text-neutral-500 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full">
          <ArrowLeft size={20} /> Volver a la tienda
        </Link>
        <div className="text-2xl font-black tracking-tighter">NIKE</div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-0">
        
        {/* ZONA DE GALERÍA MODIFICADA */}
        <div className="lg:w-1/2 relative flex items-center justify-center p-8 lg:p-24 min-h-[60vh] bg-neutral-100 overflow-hidden">
          <div ref={backgroundRef} className="absolute inset-0 opacity-20 transition-colors duration-1000"></div>
          
          {/* BOTÓN PARA CAMBIAR ENTRE FOTO Y 3D */}
          <button 
            onClick={() => setShow3D(!show3D)}
            className="absolute top-24 lg:top-8 right-8 z-30 bg-white/80 backdrop-blur-sm border border-neutral-200 px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:border-black hover:bg-black hover:text-white transition-all shadow-sm"
          >
            {show3D ? 'Ver Foto' : <><Box size={16} /> Ver en 3D</>}
          </button>

          {show3D ? (
            // VISOR 3D INTERACTIVO
            <div className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                {/* Iluminación de estudio limpia */}
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                
                <ShoePlaceholder color={dynamicColor} />
                
                {/* Sombra de contacto súper realista en el piso */}
                <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                
                {/* Controles para rotar con el mouse */}
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            </div>
          ) : (
            // IMAGEN TRADICIONAL
            <img 
              ref={imageRef}
              src={product.image} 
              alt={product.name} 
              className="w-full max-w-xl object-contain drop-shadow-2xl mix-blend-multiply relative z-10"
            />
          )}
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

          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Selecciona tu talla</h3>
              <button className="text-neutral-500 text-sm hover:text-black transition-colors">Guía de tallas</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size, index) => (
                <button 
                  key={size}
                  ref={el => sizesRef.current[index] = el} 
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

          <div className="flex gap-4">
            <button 
              onMouseEnter={handleButtonMouseEnter} 
              onMouseLeave={handleButtonMouseLeave} 
              onClick={() => {
                if (!selectedSize) {
                  showToast("Por favor, selecciona una talla primero.", "error");
                  return;
                }
                addToCart({ ...product, selectedSize }); 
                showToast("Agregado al carrito exitosamente.", "success");
              }}
              className="flex-1 bg-black text-white py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors active:scale-95 group"
            >
              <div ref={buttonIconRef}>
                <ShoppingBag size={20} />
              </div>
              Agregar al Carrito
            </button>
            <button className="p-5 border border-neutral-300 rounded-full hover:border-black transition-colors hover:bg-neutral-100">
              <Heart size={24} className="hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}