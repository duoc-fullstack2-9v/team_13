import React, { useState } from "react";
const [selectedProduct, setSelectedProduct] = useState(null);

// 👇 Evitar scroll del fondo cuando el modal está abierto
useEffect(() => {
  if (selectedProduct) {
    document.body.style.overflow = "hidden"; // bloquea el scroll
  } else {
    document.body.style.overflow = "auto"; // restaura el scroll
  }

  // Limpieza al desmontar
  return () => {
    document.body.style.overflow = "auto";
  };
}, [selectedProduct]);
import "./productos.css";

// Ejemplo de productos
import brownie from "../../assets/brownie.jpg";
import cheesecake from "../../assets/cheesecake.jpg";
import galletas from "../../assets/galletas.jpg";
import emp from "../../assets/emp.jpg";
import pan from "../../assets/pan.jpg";
import cumple from "../../assets/cumple.jpg";
import tortanaranja from "../../assets/tortanaranja.jpg";
import frutas from "../../assets/frutas.jpg";
import mouse from "../../assets/mouse.jpg";
import novios from "../../assets/novios.jpg";
import pastel1 from "../../assets/pastel1.jpg";
import santiago from "../../assets/santiago.jpg";
import tiramisui from "../../assets/tiramisui.jpg";
import vainilla from "../../assets/vainilla.jpg";
import veganachoco from "../../assets/veganachoc.jpg";

function Productos() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: "Pan KG", img: pan, desc: "Pan artesanal suave y esponjoso.", precio: "$2000 el kg"},
    { id: 2, name: "Torta de Cumpleaños", img: cumple, desc: "Ideal para celebraciones.", precio: "$30.000", tiempo:"3 días hábiles" },
    { id: 3, name: "Torta de Naranja", img: tortanaranja, desc: "Bizcocho húmedo con aroma cítrico.", precio: "$20.000", tiempo:"2 días hábiles" },
    { id: 4, name: "Tarta de Frutas", img: frutas, desc: "Fresca y colorida, con frutas de temporada.", precio: "$22.000", tiempo:"2 días hábiles" },
    { id: 5, name: "Mousse de Chocolate", img: mouse, desc: "Cremoso y suave con auténtico sabor a chocolate.", precio: "$16.000", tiempo:"1 día hábil" },
    { id: 6, name: "Torta de Novios", img: novios, desc: "Elegante y sofisticada para bodas.", precio: "$150.000", tiempo:"5 días hábiles" },
    { id: 7, name: "Pastel Clásico", img: pastel1, desc: "El favorito de todos los tiempos.", precio: "$18.000", tiempo:"2 días hábiles" },
    { id: 8, name: "Cheesecake", img: cheesecake, desc: "Suave y cremoso con base de galleta.", precio: "$20.000", tiempo:"2 días hábiles" },
    { id: 9, name: "Brownie", img: brownie, desc: "Denso y chocolatoso.", precio: "$15.000", tiempo:"1 día hábil" },
    { id: 10, name: "Galletas", img: galletas, desc: "Crujientes y llenas de sabor.", precio: "$10.000 la docena", tiempo:"1 día hábil" },
    { id: 11, name: "Empanadas", img: emp, desc: "Rellenas de trozos de manzana.", precio: "$3.000 c/u", tiempo:"1 día hábil" },
    { id: 12, name: "Tiramisú", img: tiramisui, desc: "Clásico postre italiano.",precio: "$22.000", tiempo:"2 días hábiles" },
    { id: 13, name: "Pastel de Vainilla", img: vainilla, desc: "Ligero y aromático.", precio: "$18.000", tiempo:"2 días hábiles" },
    { id: 14, name: "Torta Vegana de Chocolate", img: veganachoco, desc: "Deliciosa y libre de ingredientes animales.", precio: "$20.000", tiempo:"2 días hábiles" },
    { id: 15, name: "Torta Santiago", img: santiago, desc: "Tradicional torta con almendras y merengue.", precio: "$25.000", tiempo:"3 días hábiles" },
  ];

  return (
    <section className="productos-section">
      <h2 className="productos-title">Nuestros Productos</h2>
      <div className="productos-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="producto-card"
            onClick={() => setSelectedProduct(product)}
          >
            <img src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
          </div>
        ))}
      </div>

{selectedProduct && (
  <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{selectedProduct.name}</h2>
      <img src={selectedProduct.img} alt={selectedProduct.name} />
      <p>{selectedProduct.desc}</p>

      {/* Sección adicional: precio y tiempo */}
      <div className="modal-info">
        <p className="modal-precio">
          <strong>Precio:</strong> {selectedProduct.precio}
        </p>
        <p className="modal-tiempo">
          <strong>Tiempo estimado:</strong> {selectedProduct.tiempo}
        </p>
      </div>

      <button onClick={() => setSelectedProduct(null)}>Cerrar</button>
    </div>
  </div>
)}
    </section>
  );
}

export default Productos;