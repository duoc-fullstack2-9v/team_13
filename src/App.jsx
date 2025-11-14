import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AlertProvider } from "./contexts/AlertContext";
import LandingPage from "./pages/LandingPage";
import ProductosPage from "./pages/ProductosPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductManagerPage from "./pages/ProductManagerPage";
import AdminManager from "./components/AdminManager";
import UserOrdersPage from "./pages/UserOrdersPage";
import NosotrosPage from "./pages/NosotrosPage";
import ContactoPage from "./pages/ContactoPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

function App() {
  return (
    <AlertProvider>
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/:tab" element={<AdminDashboard />} />
              <Route path="/setup-admins" element={<AdminManager />} />
              <Route path="/mis-pedidos" element={<UserOrdersPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
