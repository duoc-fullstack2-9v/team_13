import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Productos from "./pages/products/Productos.jsx";
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Creamos un layout para Header y Footer
const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  {
    path: "/productos",
    element: <Layout><Productos /></Layout>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;