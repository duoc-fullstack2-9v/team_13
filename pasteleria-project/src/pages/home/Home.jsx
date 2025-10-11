import React from "react";
import "./home.css";
import brownie from "../../assets/brownie.jpg";
import cheesecake from "../../assets/cheesecake.jpg";
import galletas from "../../assets/galletas.jpg";
import pastel1 from "../../assets/pastel1.jpg";
import santiago from "../../assets/santiago.jpg";
import tortanaraja from "../../assets/tortanaranja.jpg";
import veganachoc from "../../assets/veganachoc.jpg";

function Home() {
  // Lista de imágenes que aparecerán automáticamente en el carrusel
  const images = [brownie, cheesecake, galletas, pastel1, santiago, tortanaraja, veganachoc];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Pastelería Mil Sabores</h1>
        <p className="home-subtitle">Delicias artesanales con sabor a hogar</p>
      </header>

      <div className="carousel">
        <div className="carousel-track">
          {/* Duplicamos el array para que la animación sea infinita */}
          {[...images, ...images].map((img, index) => (
            <img key={index} src={img} alt={`Pastel ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;