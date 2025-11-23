import { render, screen } from '@testing-library/react';
import ContactoPage from '../ContactoPage';

vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

vi.mock('../../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

describe('ContactoPage', () => {
  test('shows updated contact information', () => {
    render(<ContactoPage />);
    expect(screen.getAllByText(/Quilpué/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('team13@gruporeact.duocuc.cl').length).toBeGreaterThan(0);
  });

  test('describes how to contactar sin formulario', () => {
    render(<ContactoPage />);
    expect(screen.getByText(/Cómo podemos ayudarte/i)).toBeInTheDocument();
    expect(screen.getByText(/Puedes escribirnos o llamarnos directamente/i)).toBeInTheDocument();
  });
});
