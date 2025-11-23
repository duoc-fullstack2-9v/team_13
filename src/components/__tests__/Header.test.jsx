import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock('../CartIcon', () => ({
  default: () => <div data-testid="cart-icon">Cart</div>
}));

describe('Header component', () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  test('shows auth links when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Iniciar Sesión/)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/)).toBeInTheDocument();
  });

  test('renders admin shortcuts and greeting for admin users', () => {
    mockUseAuth.mockReturnValue({
      user: { userType: 'admin', email: 'admin@test.com', displayName: 'Admin' },
      signOut: vi.fn(),
      signInWithGoogle: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Admin/ })).toBeInTheDocument();
    expect(screen.getByText(/Mis Pedidos/)).toBeInTheDocument();
  });
});
