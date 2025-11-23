import { fireEvent, render, screen } from '@testing-library/react';
import CartIcon from '../CartIcon';

const mockClearError = vi.fn();
const mockUseCart = vi.fn();

vi.mock('../../contexts/CartContext', () => ({
  useCart: () => mockUseCart()
}));

vi.mock('../CartModal', () => ({
  default: ({ onClose }) => (
    <div data-testid="cart-modal">
      Modal
      <button onClick={onClose}>close</button>
    </div>
  )
}));

describe('CartIcon', () => {
  beforeEach(() => {
    mockClearError.mockReset();
    mockUseCart.mockReturnValue({
      totalItems: 0,
      error: null,
      clearError: mockClearError
    });
  });

  test('displays total items and opens modal on click', () => {
    mockUseCart.mockReturnValue({
      totalItems: 12,
      error: null,
      clearError: mockClearError
    });

    render(<CartIcon />);
    expect(screen.getByText('12')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Carrito/));
    expect(screen.getByTestId('cart-modal')).toBeInTheDocument();
  });

  test('clears error toast when clicking the icon', () => {
    mockUseCart.mockReturnValue({
      totalItems: 0,
      error: 'Stock insuficiente',
      clearError: mockClearError
    });

    render(<CartIcon />);
    expect(screen.getByText('Stock insuficiente')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Carrito/));
    expect(mockClearError).toHaveBeenCalled();
  });
});
