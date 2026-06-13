import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LeaveForm from '../LeaveForm';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getLeaveBalance: vi.fn(() => Promise.resolve({ annual: 20, sick: 10, maternity: 90 })),
  createLeaveRequest: vi.fn(() => Promise.resolve({ id: '1', status: 'PENDING' })),
  getEmployees: vi.fn(() => Promise.resolve([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ])),
}));

describe('LeaveForm', () => {
  it('renders leave form correctly', () => {
    render(<LeaveForm />);
    
    expect(screen.getByText(/leave request/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/leave type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('displays leave balance', async () => {
    render(<LeaveForm />);

    await waitFor(() => {
      expect(screen.getByText(/annual leave/i)).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });
  });

  it('shows validation error for missing leave type', async () => {
    render(<LeaveForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/leave type is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for missing dates', async () => {
    render(<LeaveForm />);
    
    const leaveTypeSelect = screen.getByLabelText(/leave type/i);
    fireEvent.change(leaveTypeSelect, { target: { value: 'ANNUAL' } });
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
    });
  });

  it('calculates leave duration correctly', async () => {
    render(<LeaveForm />);

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-02-05' } });

    await waitFor(() => {
      expect(screen.getByText(/5 days/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const { createLeaveRequest } = await import('../../services/api');
    
    render(<LeaveForm />);
    
    const leaveTypeSelect = screen.getByLabelText(/leave type/i);
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const reasonInput = screen.getByLabelText(/reason/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(leaveTypeSelect, { target: { value: 'ANNUAL' } });
    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-02-05' } });
    fireEvent.change(reasonInput, { target: { value: 'Family vacation' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createLeaveRequest).toHaveBeenCalled();
    });
  });

  it('shows error when insufficient leave balance', async () => {
    const { getLeaveBalance } = await import('../../services/api');
    getLeaveBalance.mockResolvedValue({ annual: 2, sick: 10, maternity: 90 });

    render(<LeaveForm />);

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-02-10' } });

    await waitFor(() => {
      expect(screen.getByText(/insufficient leave balance/i)).toBeInTheDocument();
    });
  });
});
