import React from "react";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Pastel de Chocolate Belga",
      description:
        "Exquisito pastel de chocolate belga con relleno de ganache y cubierta de frutos rojos",
      price: "€45.000",
      image: "/images/pastel-chocolate.jpg",
      category: "pasteles",
    },
    {
      id: 2,
      name: "Torta Red Velvet",
      description:
        "Clásica torta red velvet con frosting de queso crema y decoración elegante",
      price: "€52.000",
      image: "/images/red-velvet.jpg",
      category: "pasteles",
    },
    // ... más productos
  ];

  return (
    <section id="productos" className="products-section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Nuestros Productos</h2>
          <p className="section-subtitle">Los favoritos de nuestros clientes</p>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4">
              <div className="product-card">
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                  />
                  <div className="product-overlay">
                    <button className="btn btn-primary btn-sm">
                      Ver Detalles
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">{product.price}</div>
                  <button className="btn btn-outline-primary w-100">
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
