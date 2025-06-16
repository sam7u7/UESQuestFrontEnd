import React, { useState, useEffect } from 'react';

const images = [
  "/img/bienvenida11.jpg",
  "/img/bienvenida10.jpg",
  "/img/bienvenida5.jpg",
];

function WelcomeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  return (
  <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-lg shadow-lg">
  <img
    src={images[currentIndex]}
    alt="Banner"
    className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover transition-opacity duration-1000"
  />
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0">
    
  </div>
</div>
);
}

export default WelcomeBanner;