import { fireEvent, render, screen } from '@testing-library/react';
import { AlertProvider, useAlert } from '../AlertContext';

const TestComponent = () => {
  const { showSuccess, showError, clearAllAlerts, alerts } = useAlert();
  return (
    <div>
      <button onClick={() => showSuccess('Operación exitosa', 0)}>success</button>
      <button onClick={() => showError('Algo falló', 10)}>error</button>
      <button onClick={clearAllAlerts}>clear</button>
      <span data-testid="alerts-count">{alerts.length}</span>
    </div>
  );
};

describe('AlertContext', () => {
  test('adds and clears alerts via helper methods', () => {
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>
    );

    fireEvent.click(screen.getByText('success'));
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    expect(screen.getByTestId('alerts-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('error'));
    expect(screen.getByText('Algo falló')).toBeInTheDocument();
    expect(screen.getByTestId('alerts-count')).toHaveTextContent('2');

    fireEvent.click(screen.getByText('clear'));
    expect(screen.queryByText('Operación exitosa')).not.toBeInTheDocument();
    expect(screen.queryByText('Algo falló')).not.toBeInTheDocument();
    expect(screen.getByTestId('alerts-count')).toHaveTextContent('0');
  });
});
