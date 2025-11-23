import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductosPage from '../ProductosPage';

const mockApi = vi.hoisted(() => ({
  getProducts: vi.fn(),
  getCategories: vi.fn()
}));

vi.mock('../../components/Header', () => ({
  default: () => <div>Header</div>
}));

vi.mock('../../components/Footer', () => ({
  default: () => <div>Footer</div>
}));

vi.mock('../../components/Categorias', () => ({
  default: ({ categorias }) => (
    <div data-testid="categorias">{categorias.length} categorías</div>
  )
}));

vi.mock('../../components/ProductCard', () => ({
  default: ({ producto }) => <div>{producto.nombre}</div>
}));

vi.mock('../../services/apiService', () => ({
  __esModule: true,
  default: mockApi
}));

describe('ProductosPage', () => {
  beforeEach(() => {
    mockApi.getProducts.mockReset();
    mockApi.getCategories.mockReset();
  });

  test('loads products and renders list', async () => {
    mockApi.getProducts.mockResolvedValue([
      { codigo: 'a1', nombre: 'Cheesecake', categoria: 'todos' }
    ]);
    mockApi.getCategories.mockResolvedValue(['TODOS']);

    render(
      <MemoryRouter initialEntries={['/productos']}>
        <Routes>
          <Route path="/productos" element={<ProductosPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Cheesecake')).toBeInTheDocument());
    expect(screen.getByTestId('categorias')).toHaveTextContent('2'); // incluye "todos"
  });

  test('shows error message when loading fails', async () => {
    mockApi.getProducts.mockRejectedValue(new Error('Fallo'));
    mockApi.getCategories.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/productos']}>
        <Routes>
          <Route path="/productos" element={<ProductosPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Error al cargar productos/)).toBeInTheDocument());
  });
});
