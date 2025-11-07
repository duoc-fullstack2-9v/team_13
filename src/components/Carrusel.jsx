import React, { useState, useEffect } from "react";
import "../styles/Carrusel.css";

const Carrusel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "50 Años de Tradición",
      description: "Celebrando medio siglo de los sabores más dulces",
      backgroundImage: "/images/productos/TC001.jpg"
    },
    {
      id: 2,
      title: "Récord Guinness 1995",
      description: "Creadores de la torta más grande del mundo",
      backgroundImage: "/images/productos/TE001.jpg"
    },
    {
      id: 3,
      title: "Productos de Calidad",
      description: "Elaborados con los mejores ingredientes",
      backgroundImage: "/images/productos/PT001.jpg"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="carrusel">
      <div className="carrusel-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carrusel-slide ${
              index === currentSlide ? "active" : ""
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(136, 69, 19, 0.7), rgba(136, 69, 19, 0.7)), url(${slide.backgroundImage})`
            }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <button className="cta-button">Ver Productos</button>
            </div>
          </div>
        ))}
      </div>
      <div className="carrusel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrusel;
