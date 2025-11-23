import { act, fireEvent, render, screen } from '@testing-library/react';
import CustomAlert, { useCustomAlert } from '../CustomAlert';

const AlertContainer = () => {
  const { showAlert, alerts } = useCustomAlert();
  return (
    <div>
      <button onClick={() => showAlert('Hola', 'success', 0)}>show</button>
      <span data-testid="alert-count">{alerts.length}</span>
    </div>
  );
};

describe('CustomAlert component', () => {
  test('renders alert with proper icon and closes on command', () => {
    vi.useFakeTimers();
    render(<CustomAlert message="operación" type="success" autoClose={false} />);
    expect(screen.getByText('operación')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /×/ }));
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByText('operación')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  test('useCustomAlert helper stores alerts in memory', () => {
    render(<AlertContainer />);
    fireEvent.click(screen.getByText('show'));
    expect(screen.getByTestId('alert-count')).toHaveTextContent('1');
  });
});
