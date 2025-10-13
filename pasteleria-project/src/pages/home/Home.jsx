import React from "react";
import "./home.css";
import brownie from "../../assets/brownie.jpg";
import cheesecake from "../../assets/cheesecake.jpg";
import galletas from "../../assets/galletas.jpg";
import pastel1 from "../../assets/pastel1.jpg";
import santiago from "../../assets/santiago.jpg";
import tortanaraja from "../../assets/tortanaranja.jpg";
import veganachoc from "../../assets/veganachoc.jpg";
import logo from "../../assets/logo01.png"; // Asegúrate de importar tu logo

function Home() {
  // Lista de imágenes que aparecerán automáticamente en el carrusel
  const images = [brownie, cheesecake, galletas, pastel1, santiago, tortanaraja, veganachoc];

  return (
    <div className="home-section">
      {/* Logo centrado - REEMPLAZA el header anterior */}
      <div className="logo-section">
        <img 
          src={logo} 
          alt="Pastelería Mil Sabores" 
          className="main-logo"
        />
      </div>

      {/* Carrusel se mantiene igual */}
      <div className="home-carousel">
        <div className="carousel">
          <div className="carousel-track">
            {[...images, ...images].map((img, index) => (
              <img key={index} src={img} alt={`Pastel ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
