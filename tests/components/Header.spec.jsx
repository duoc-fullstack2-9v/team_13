import { render, screen } from '@testing-library/react';
import React from 'react';
import Header from '../../src/components/Header';

// Mock react-router-dom para los Links y hooks
vi.mock('react-router-dom', () => ({
  Link: ({ children }) => <a>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn()
}));

// Mock del AuthContext
vi.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn()
  })
}));

describe('Header Component', () => {
  it('se renderiza sin errores', () => {
    render(<Header />);
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('muestra el nombre de la pastelería', () => {
    render(<Header />);
    expect(screen.getByText(/Pastelería Mil Sabores/i)).toBeInTheDocument();
  });
});