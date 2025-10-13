import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Productos from "./pages/products/Productos.jsx";
import Layout from './components/Layout'; // ← Importa el Layout

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>, // ← Envuelve con Layout
  },
  {
    path: "/productos",
    element: <Layout><Productos /></Layout>, // ← Envuelve con Layout
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;