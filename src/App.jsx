import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import ProductosPage from "./pages/ProductosPage";
import RegisterPage from "./pages/RegisterPage";
import ProductManagerPage from "./pages/ProductManagerPage";
import AdminManager from "./components/AdminManager";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/productos/:categoria" element={<ProductosPage />} />
          <Route path="/admin/productos" element={<ProductManagerPage />} />
          <Route path="/setup-admins" element={<AdminManager />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
