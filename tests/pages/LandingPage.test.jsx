/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import LandingPage from '../../src/pages/LandingPage';

// Mock de los componentes hijos
vi.mock('../../src/components/Carrusel', () => ({
  default: () => <div data-testid="mock-carrusel">Carrusel</div>
}));

vi.mock('../../src/components/Categorias', () => ({
  default: () => <div data-testid="mock-categorias">Categorias</div>
}));

describe('LandingPage Component', () => {
  const renderWithProviders = (component) => {
    return render(
      <AuthProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthProvider>
    );
  };

  it('renderiza sin errores', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByTestId('mock-carrusel')).toBeInTheDocument();
  });
});