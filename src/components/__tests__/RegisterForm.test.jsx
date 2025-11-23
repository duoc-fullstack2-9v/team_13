import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RegisterForm from '../RegisterForm';

const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockShowAlert = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle
  })
}));

vi.mock('../../contexts/AlertContext', () => ({
  useAlert: () => ({
    showAlert: mockShowAlert
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Tu apellido'), { target: { value: 'User' } });
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'test@demo.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 6 caracteres'), { target: { value: 'Secret1' } });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: 'Secret1' } });
  };

  test('submits valid form and calls signUp', async () => {
    mockSignUp.mockResolvedValue({});
    render(<RegisterForm />);
    fillForm();

    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }));
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@demo.com', 'Secret1', {
        nombre: 'Test',
        apellido: 'User'
      });
      expect(mockShowAlert).toHaveBeenCalledWith(expect.stringMatching(/Registro exitoso/), 'success');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('shows validation errors for invalid input', () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }));
    expect(mockSignUp).not.toHaveBeenCalled();
    expect(mockShowAlert).toHaveBeenCalledWith(expect.stringMatching(/corrige/), 'error');
  });

  test('allows Google registration shortcut', async () => {
    mockSignInWithGoogle.mockResolvedValue({});
    render(<RegisterForm />);
    fireEvent.click(screen.getByText(/Registrarse con Google/));
    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalled());
  });

  test('shows alert when sign up fails with Firebase error', async () => {
    const onError = vi.fn();
    mockSignUp.mockRejectedValue({ code: 'auth/email-already-in-use' });
    render(<RegisterForm onError={onError} />);
    fillForm();

    fireEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }));
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(mockShowAlert).toHaveBeenCalledWith(expect.stringContaining('ya está registrado'), 'error');
    });
  });

  test('shows alert when Google sign up fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('fail'));
    render(<RegisterForm />);
    fireEvent.click(screen.getByText(/Registrarse con Google/));
    await waitFor(() => expect(mockShowAlert).toHaveBeenCalledWith(
      'Error al registrarse con Google',
      'error'
    ));
  });
});
