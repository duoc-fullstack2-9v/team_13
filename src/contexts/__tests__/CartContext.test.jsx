import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';

const sampleProduct = {
  id: 'prod-1',
  nombre: 'Torta Selva Negra',
  precio: 12000,
  stock: 5
};

const mockApi = vi.hoisted(() => ({
  getProductStock: vi.fn(),
  createOrder: vi.fn(),
  getUserByEmail: vi.fn(),
  createUser: vi.fn()
}));

vi.mock('../AuthContext', () => ({
  useAuth: () => ({
    user: {
      email: 'cliente@test.com',
      displayName: 'Cliente Test'
    }
  })
}));

vi.mock('../../services/apiService', () => ({
  __esModule: true,
  default: mockApi
}));

const CartTestComponent = () => {
  const { addToCart, createOrder, totalItems, items, error } = useCart();
  return (
    <div>
      <button onClick={() => addToCart(sampleProduct, 2)}>add</button>
      <button onClick={() => createOrder(0, null, { observaciones: 'Sin azúcar' })}>order</button>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="items-count">{items.length}</span>
      {error && <p>{error}</p>}
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    Object.values(mockApi).forEach((fn) => fn.mockReset());
  });

  test('adds items respecting stock and creates orders for authenticated users', async () => {
    mockApi.getProductStock.mockResolvedValueOnce(5); // addToCart check
    mockApi.getProductStock.mockResolvedValueOnce(5); // createOrder check
    mockApi.getUserByEmail.mockResolvedValue(null);
    mockApi.createUser.mockResolvedValue({});
    mockApi.createOrder.mockResolvedValue({ pedido: { id: 101 } });

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('add'));
    await waitFor(() => expect(screen.getByTestId('total-items')).toHaveTextContent('2'));

    fireEvent.click(screen.getByText('order'));
    await waitFor(() => {
      expect(mockApi.createOrder).toHaveBeenCalled();
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });
  });

  test('notifies when trying to add items without stock', async () => {
    mockApi.getProductStock.mockResolvedValue(0);

    render(
      <CartProvider>
        <CartTestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('add'));
    await waitFor(() => {
      expect(screen.getByText(/está agotado/i)).toBeInTheDocument();
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    });
  });
});
