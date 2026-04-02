import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';

export default function useImageColor(imageUrl) {
  // Empezamos con el color gris claro (neutral-100 de Tailwind)
  const [color, setColor] = useState('#f5f5f5'); 

  useEffect(() => {
    if (!imageUrl) return;

    // 1. Creamos un elemento de imagen virtual
    const img = new Image();
    
    // 2. LA CLAVE MÁGICA: Pedimos permiso al servidor de Unsplash
    img.crossOrigin = 'Anonymous'; 
    
    // 3. Le asignamos nuestra URL
    img.src = imageUrl;

    // 4. Solo cuando la imagen cargó completamente, extraemos el color
    img.onload = () => {
      const fac = new FastAverageColor();
      
      fac.getColorAsync(img, { algorithm: 'dominant' })
        .then(colorResult => {
          // colorResult.rgba nos da algo como 'rgba(200, 50, 50, 1)'
          setColor(colorResult.rgba); 
          fac.destroy(); // Limpiamos la memoria
        })
        .catch(e => {
          console.error("Error extrayendo color:", e);
        });
    };
    
    img.onerror = () => {
      console.error("CORS bloqueó la imagen o el enlace está roto:", imageUrl);
    };

  }, [imageUrl]);

  return color;
}