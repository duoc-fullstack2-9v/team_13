import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserOrdersPage from '../UserOrdersPage';

const mockGetOrdersByUser = vi.fn();
const mockGetOrderTracking = vi.fn();

vi.mock('../../services/apiService', () => ({
  __esModule: true,
  default: {
    getOrdersByUser: (...args) => mockGetOrdersByUser(...args),
    getOrderTracking: (...args) => mockGetOrderTracking(...args)
  }
}));

const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock('../../components/Header', () => ({
  default: () => <div>Header</div>
}));

describe('UserOrdersPage', () => {
  beforeEach(() => {
    mockGetOrdersByUser.mockReset();
    mockGetOrderTracking.mockReset();
    mockUseAuth.mockReturnValue({
      user: { email: 'cliente@test.com', displayName: 'Cliente', userType: 'customer' },
      loading: false
    });
  });

  test('renders orders list and toggles details', async () => {
    mockGetOrdersByUser.mockResolvedValue([
      {
        id: '1',
        numeroPedido: 'A-1',
        fechaCreacion: '2024-01-01T10:00:00Z',
        estado: 'PENDIENTE',
        items: [
          {
            cantidad: 1,
            producto: { nombre: 'Torta' },
            subtotal: 10000
          }
        ],
        total: 10000,
        clienteEmail: 'cliente@test.com'
      }
    ]);

    render(
      <MemoryRouter>
        <UserOrdersPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Mis Pedidos/)).toBeInTheDocument());
    expect(screen.getByText('Torta')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Ver Detalles/));
    expect(screen.getByText('cliente@test.com')).toBeInTheDocument();
  });
});
