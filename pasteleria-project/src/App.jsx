import './App.css'

import Home from "./pages/home/Home.jsx";
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Productos from './pages/products/Productos.jsx';

function App() {
  return (
    <div>
      <Header />
      <Home />
      
      <div id="productos">
        <Productos />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;