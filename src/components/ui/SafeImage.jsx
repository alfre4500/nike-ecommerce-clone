import React, { useState } from 'react';

export default function SafeImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  // Imagen de reemplazo sobria y minimalista por si falla el link original
  const fallbackImg = "https://via.placeholder.com/500x500/eeeeee/999999?text=Imagen+No+Disponible";

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackImg)} // Si hay error, cambia a la imagen de respaldo
      loading="lazy" // Native Lazy Loading: Mejora drásticamente el rendimiento inicial
      {...props}
    />
  );
}