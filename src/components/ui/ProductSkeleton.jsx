import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Espacio para la Imagen */}
      <div className="bg-neutral-200 aspect-square rounded-2xl w-full relative overflow-hidden">
        {/* Efecto Shimmer manual con CSS */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]"></div>
      </div>
      
      {/* Título y Categoría */}
      <div className="space-y-2 px-2">
        <div className="h-5 bg-neutral-200 rounded-full w-3/4"></div>
        <div className="h-4 bg-neutral-100 rounded-full w-1/2"></div>
        <div className="h-6 bg-neutral-200 rounded-full w-1/4 mt-4"></div>
      </div>
    </div>
  );
}