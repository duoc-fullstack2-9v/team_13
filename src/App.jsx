import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductosPage from "./pages/ProductosPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/productos/:categoria" element={<ProductosPage />} />
      </Routes>
    </div>
  );
}

export default App;
