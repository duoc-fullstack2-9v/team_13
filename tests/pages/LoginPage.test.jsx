/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import LoginPage from '../../src/pages/LoginPage';

// Mock del LoginForm
vi.mock('../../src/components/LoginForm', () => ({
  default: () => <div data-testid="mock-login-form">Login Form</div>
}));

describe('LoginPage Component', () => {
  it('renderiza sin errores', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();
  });
});