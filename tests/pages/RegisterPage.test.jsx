/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import RegisterPage from '../../src/pages/RegisterPage';

// Mock del RegisterForm
vi.mock('../../src/components/RegisterForm', () => ({
  default: () => <div data-testid="mock-register-form">Register Form</div>
}));

// Mock del ResultModal
vi.mock('../../src/components/ResultModal', () => ({
  default: () => <div data-testid="mock-result-modal">Result Modal</div>
}));

describe('RegisterPage Component', () => {
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
    renderWithProviders(<RegisterPage />);
    expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();
  });

  it('muestra el título de registro', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByRole('heading', { level: 1, name: /crear cuenta/i })).toBeInTheDocument();
  });
});