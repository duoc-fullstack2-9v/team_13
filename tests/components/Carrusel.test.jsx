/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import Carrusel from '../../src/components/Carrusel';

describe('Carrusel Component', () => {
  it('renderiza sin errores', () => {
    render(<Carrusel />);
    expect(screen.getByText('50 Años de Tradición')).toBeInTheDocument();
  });

  it('muestra los slides correctos', () => {
    render(<Carrusel />);
    expect(screen.getByText('Récord Guinness 1995')).toBeInTheDocument();
    expect(screen.getByText('Productos de Calidad')).toBeInTheDocument();
  });
});