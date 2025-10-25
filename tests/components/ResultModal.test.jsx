/**
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ResultModal from '../../src/components/ResultModal';

describe('ResultModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Title',
    message: 'Test Message',
    type: 'success'
  };

  it('renderiza correctamente un modal de éxito', () => {
    render(<ResultModal {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.getByText('¡Entendido!')).toBeInTheDocument();
  });

  it('renderiza correctamente un modal de error', () => {
    render(<ResultModal {...mockProps} type="error" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });

  it('renderiza correctamente un modal por defecto', () => {
    render(<ResultModal {...mockProps} type="info" />);
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('llama a onClose cuando se hace clic en el botón', () => {
    const onClose = vi.fn();
    render(<ResultModal {...mockProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('¡Entendido!'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('aplica las clases correctas según el tipo', () => {
    const { container } = render(<ResultModal {...mockProps} />);
    expect(container.querySelector('.modal-header.success')).toBeInTheDocument();
    expect(container.querySelector('.btn-success')).toBeInTheDocument();
  });
});