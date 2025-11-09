import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import LandingPage from "./pages/LandingPage";
import ProductosPage from "./pages/ProductosPage";
import RegisterPage from "./pages/RegisterPage";
import ProductManagerPage from "./pages/ProductManagerPage";
import AdminManager from "./components/AdminManager";
import UserOrdersPage from "./pages/UserOrdersPage";
import NosotrosPage from "./pages/NosotrosPage";
import ContactoPage from "./pages/ContactoPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPedidosPage from "./pages/AdminPedidosPage";
import AdminUsuariosPage from "./pages/AdminUsuariosPage";
import AdminVentasPage from "./pages/AdminVentasPage";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:categoria" element={<ProductosPage />} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productos" element={<ProductManagerPage />} />
            <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
            <Route path="/admin/ventas" element={<AdminVentasPage />} />
            <Route path="/admin/reportes" element={<AdminDashboard />} />
            <Route path="/setup-admins" element={<AdminManager />} />
            <Route path="/mis-pedidos" element={<UserOrdersPage />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
