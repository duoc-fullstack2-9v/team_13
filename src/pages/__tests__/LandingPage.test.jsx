import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

vi.mock('../../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('../../components/Carrusel', () => ({
  default: () => <div data-testid="carrusel">Carrusel</div>
}));

describe('LandingPage', () => {
  test('renders hero sections and CTA', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText(/50 Años Endulzando/)).toBeInTheDocument();
    expect(screen.getByText(/Ver Productos/)).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
