/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import RegisterForm from '../../src/components/RegisterForm';

describe('RegisterForm Component', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  const renderForm = () => {
    return render(
      <RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />
    );
  };

  it('renderiza sin errores', () => {
    renderForm();
    expect(screen.getByRole('heading', { level: 3, name: 'Información Personal' })).toBeInTheDocument();
  });

  it('muestra los campos del primer paso', () => {
    renderForm();
    expect(screen.getByLabelText('Nombres *')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellidos *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Nacimiento')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /siguiente paso/i })).toBeInTheDocument();
  });

  it('valida campos requeridos', async () => {
    renderForm();
    const siguienteBtn = screen.getByText('Siguiente Paso');
    expect(siguienteBtn).toBeDisabled();

    // Llenar campos requeridos
    fireEvent.change(screen.getByLabelText('Nombres *'), {
      target: { value: 'Juan' }
    });
    fireEvent.change(screen.getByLabelText('Apellidos *'), {
      target: { value: 'Pérez' }
    });
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'juan@example.com' }
    });

    // Ahora el botón debería estar habilitado
    expect(siguienteBtn).toBeEnabled();
  });
});