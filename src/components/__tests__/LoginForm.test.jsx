import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';

const mockSignIn = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signInWithGoogle: mockSignInWithGoogle
  })
}));

vi.mock('../../contexts/AlertContext', () => ({
  useAlert: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, ...rest }) => <a {...rest}>{children}</a>
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates form and calls signIn on success', async () => {
    mockSignIn.mockResolvedValue({});
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: ' user@test.com ' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'secret123' } });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/ }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@test.com', 'secret123');
      expect(mockShowSuccess).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows error when validation fails', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: '123' } });
    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/ });
    fireEvent.submit(submitButton.closest('form'));

    await waitFor(() => {
      expect(document.body.innerHTML).toContain('formato del email no es válido');
      expect(document.body.innerHTML).toContain('La contraseña debe tener al menos 6 caracteres');
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  test('handles Google login shortcut', async () => {
    mockSignInWithGoogle.mockResolvedValue({});
    render(<LoginForm />);

    fireEvent.click(screen.getByText(/Continuar con Google/));
    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalled());
  });

  test('shows Firebase error message when credentials are invalid', async () => {
    const onError = vi.fn();
    mockSignIn.mockRejectedValue({ code: 'auth/wrong-password' });
    render(<LoginForm onError={onError} />);

    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/), { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Iniciar Sesión/ }).closest('form'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(mockShowError).toHaveBeenCalledWith(
        expect.stringContaining('Contraseña incorrecta.')
      );
    });
  });

  test('shows alert when Google login fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('boom'));
    render(<LoginForm />);

    fireEvent.click(screen.getByText(/Continuar con Google/));
    await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(
      expect.stringContaining('Google')
    ));
  });
});
