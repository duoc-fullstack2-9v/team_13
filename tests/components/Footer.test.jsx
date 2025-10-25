/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from '../../src/components/Footer';

describe('Footer Component', () => {
  it('se renderiza sin errores', () => {
    render(<Footer />);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });

  it('renderiza información de contacto', () => {
    render(<Footer />);
    expect(screen.getByText(/info@mil-sabores.cl/)).toBeInTheDocument();
  });

  it('renderiza los derechos reservados', () => {
    render(<Footer />);
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument();
  });

  it('muestra el año actual', () => {
    render(<Footer />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});