import React, { useState } from "react";
import "./products.css";

// Ejemplo de productos
import brownie from "../../assets/brownie.jpg";
import cheesecake from "../../assets/cheesecake.jpg";
import galletas from "../../assets/galletas.jpg";
import emp from "../../assets/emp.jpg";
import pan from "../../assets/pan.jpg";
import cumple from "../../assets/cumple.jpg";
import tortanaranja from "../../assets/tortanaraja.jpg";
import frutas from "../../assets/frutas.jpg";
import mouse from "../../assets/mouse.jpg";
import novios from "../../assets/novios.jpg";
import pastel1 from "../../assets/pastel1.jpg";
import santiago from "../../assets/santiago.jpg";
import tiramisui from "../../assets/tiramisui.jpg";
import vainilla from "../../assets/vainilla.jpg";
import veganachoco from "../../assets/veganachoc.jpg";

const productList = [
  { id: 1, name: "Brownie", price: "$2500", img: brownie, description: "Delicioso brownie de chocolate con nueces." },
  { id: 2, name: "Cheesecake", price: "$4500", img: cheesecake, description: "Cheesecake cremoso con base de galleta." },
  { id: 3, name: "Galletas", price: "$1500", img: galletas, description: "Galletas artesanales recién horneadas." },
  { id: 4, name: "Empanadas de manzana", price: "$1800", img: emp, description: "Empanadas de manzana." },
  { id: 5, name: "Pan Kg", price: "$2000", img: pan, description: "Pan casero horneado." },
  { id: 6, name: "Torta de cumpleaños", price: "$30000", img: cumple, description: "Torta personalizada para cumpleaños." },
  { id: 7, name: "Torta de naranja", price: "$12000", img: tortanaranja, description: "Torta esponjosa de naranja con glaseado." },
  { id: 8, name: "Torta de frutas", price: "$15000", img: frutas, description: "Torta decorada con frutas frescas." },
  { id: 9, name: "Mousse de chocolate", price: "$3500", img: mouse, description: "Mousse ligero de chocolate." },
  { id: 10, name: "Torta de novios", price: "$50000", img: novios, description: "Torta elegante para bodas." },
  { id: 11, name: "Pastel de chocolate", price: "$14000", img: pastel1, description: "Pastel clásico de chocolate." },
  { id: 12, name: "Torta Santiago", price: "$16000", img: santiago, description: "Torta tradicional de Santiago." },
  { id: 13, name: "Tiramisú", price: "$4000", img: tiramisui, description: "Tiramisú italiano con café." },
  { id: 14, name: "Torta de vainilla", price: "$13000", img: vainilla, description: "Torta esponjosa de vainilla." },
  { id: 15, name: "Torta vegana de chocolate", price: "$15000", img: veganachoco, description: "Torta vegana de chocolate." },
];

function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="products-container">
      <h1>Catálogo de Productos</h1>
      <div className="products-grid">
        {productList.map((product) => (
          <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
            <img src={product.img} alt={product.name} />
            <p>{product.name}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedProduct(null)}>&times;</span>
            <img src={selectedProduct.img} alt={selectedProduct.name} />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p className="price">{selectedProduct.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;