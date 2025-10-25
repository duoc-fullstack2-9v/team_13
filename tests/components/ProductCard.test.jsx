/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import ProductCard from '../../src/components/ProductCard';

describe('ProductCard Component', () => {
  const mockProducto = {
    codigo: 'torta-chocolate',
    nombre: 'Torta de Chocolate',
    precio: '$15.000',
    descripcion: 'Deliciosa torta de chocolate',
    categoria: 'Tortas'
  };

  it('renderiza el producto correctamente', () => {
    render(<ProductCard producto={mockProducto} />);
    expect(screen.getByText(mockProducto.nombre)).toBeInTheDocument();
    expect(screen.getByText(mockProducto.precio)).toBeInTheDocument();
    expect(screen.getByText(mockProducto.categoria)).toBeInTheDocument();
    expect(screen.getByText(mockProducto.descripcion)).toBeInTheDocument();
  });

  it('muestra la imagen del producto', () => {
    render(<ProductCard producto={mockProducto} />);
    const imagen = screen.getByAltText(mockProducto.nombre);
    expect(imagen).toBeInTheDocument();
    expect(imagen.src).toContain(`images/productos/${mockProducto.codigo}.jpg`);
  });

  it('tiene un botón de añadir al carrito', () => {
    render(<ProductCard producto={mockProducto} />);
    expect(screen.getByText('Añadir al Carrito')).toBeInTheDocument();
  });

  it('muestra la información en el orden correcto', () => {
    const { container } = render(<ProductCard producto={mockProducto} />);
    const productInfo = container.querySelector('.product-info');
    
    expect(productInfo.children[0].textContent).toBe(mockProducto.nombre);
    expect(productInfo.children[1].textContent).toBe(mockProducto.categoria);
    expect(productInfo.children[2].textContent).toBe(mockProducto.descripcion);
  });
});