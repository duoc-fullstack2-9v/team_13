import { render } from '@testing-library/react';
import React from 'react';

// Mock de todos los componentes y contextos
vi.mock('../src/components/Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer</div>
}));

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="mock-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="mock-routes">{children}</div>,
  Route: () => null,
  Link: ({ children }) => <a>{children}</a>,
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn()
}));

vi.mock('../src/contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="mock-auth">{children}</div>,
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn()
  })
}));

// Import App después de los mocks
import App from '../src/App';

describe('App Component', () => {
  it('renderiza la estructura básica', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeInTheDocument();
  });
});