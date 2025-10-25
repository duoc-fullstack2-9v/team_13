/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import ProductosPage from '../../src/pages/ProductosPage';
import { productos, categorias } from '../../src/data/products';

vi.mock('../../src/data/products', () => ({
  productos: [
    { id: 1, nombre: 'Torta 1', precio: '$10.000', categoria: 'tortas' },
    { id: 2, nombre: 'Torta 2', precio: '$15.000', categoria: 'tortas' }
  ],
  categorias: [
    { id: 'todos', nombre: 'Todos' },
    { id: 'tortas', nombre: 'Tortas' },
    { id: 'pasteles', nombre: 'Pasteles' }
  ]
}));

// Mock del ProductCard
vi.mock('../../src/components/ProductCard', () => ({
  default: ({ producto }) => (
    <div data-testid="mock-product-card">
      {producto.nombre} - {producto.precio}
    </div>
  )
}));

// Mock de Categorias
vi.mock('../../src/components/Categorias', () => ({
  default: ({ onCategoriaChange }) => (
    <div data-testid="mock-categorias">
      Categorías
    </div>
  )
}));

describe('ProductosPage Component', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza sin errores', () => {
    renderWithProviders(<ProductosPage />);
    expect(screen.getByText('Nuestros Productos')).toBeInTheDocument();
    expect(screen.getByTestId('mock-categorias')).toBeInTheDocument();
  });

  it('muestra la lista de productos', () => {
    renderWithProviders(<ProductosPage />);
    const productCards = screen.getAllByTestId('mock-product-card');
    expect(productCards).toHaveLength(2);
    expect(productCards[0]).toHaveTextContent('Torta 1 - $10.000');
    expect(productCards[1]).toHaveTextContent('Torta 2 - $15.000');
  });
});