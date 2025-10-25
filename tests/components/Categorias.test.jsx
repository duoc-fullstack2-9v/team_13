/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Categorias from '../../src/components/Categorias';

const mockCategorias = [
  { id: 'todos', nombre: 'Todos', icono: '🍰' },
  { id: 'tortas', nombre: 'Tortas', icono: '🎂' },
  { id: 'pasteles', nombre: 'Pasteles', icono: '🧁' }
];

describe('Categorias Component', () => {
  const renderCategorias = (props = {}) => {
    const defaultProps = {
      categorias: mockCategorias,
      categoriaActiva: 'todos',
      onCategoriaChange: vi.fn(),
      ...props
    };

    return render(
      <BrowserRouter>
        <Categorias {...defaultProps} />
      </BrowserRouter>
    );
  };

  it('renderiza sin errores', () => {
    renderCategorias();
    expect(screen.getByText('Nuestras Categorías')).toBeInTheDocument();
  });

  it('muestra todas las categorías', () => {
    renderCategorias();
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Tortas')).toBeInTheDocument();
    expect(screen.getByText('Pasteles')).toBeInTheDocument();
  });

  it('llama a onCategoriaChange al hacer click en una categoría', () => {
    const onCategoriaChange = vi.fn();
    renderCategorias({ onCategoriaChange });
    
    fireEvent.click(screen.getByText('Tortas'));
    expect(onCategoriaChange).toHaveBeenCalledWith('tortas');
  });
});