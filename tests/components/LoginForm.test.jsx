/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import LoginForm from '../../src/components/LoginForm';
import { AuthProvider } from '../../src/contexts/AuthContext';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }) => <a>{children}</a>
}));

// Mock del contexto de autenticación
vi.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn()
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('LoginForm Component', () => {
  const renderLoginForm = () => {
    return render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  };

  it('renderiza sin errores', () => {
    renderLoginForm();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Ingresa a tu cuenta de Pastelería Mil Sabores')).toBeInTheDocument();
  });

  it('muestra los campos del formulario', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Nombre de Usuario *')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña *')).toBeInTheDocument();
    expect(screen.getByText('Ingresar a Mi Cuenta')).toBeInTheDocument();
  });

  it('muestra errores de validación cuando los campos están vacíos', async () => {
    renderLoginForm();
    const submitButton = screen.getByText('Ingresar a Mi Cuenta');
    
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('El nombre de usuario es obligatorio')).toBeInTheDocument();
    expect(await screen.findByText('La contraseña es obligatoria')).toBeInTheDocument();
  });

  it('permite ingresar datos en los campos', () => {
    renderLoginForm();
    const usernameInput = screen.getByLabelText('Nombre de Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });

    expect(usernameInput.value).toBe('admin');
    expect(passwordInput.value).toBe('admin123');
  });

  it('muestra las cuentas de demo', () => {
    renderLoginForm();
    expect(screen.getByText('Cuentas de Demo:')).toBeInTheDocument();
    expect(screen.getByText(/admin \/ admin123/)).toBeInTheDocument();
    expect(screen.getByText(/usuario \/ user123/)).toBeInTheDocument();
  });
});