import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getDashboardStats: vi.fn(() => Promise.resolve({
    totalEmployees: 50,
    activeEmployees: 45,
    presentToday: 42,
    onLeave: 3,
    pendingLeaves: 5,
    openPositions: 8,
  })),
  getRecentActivity: vi.fn(() => Promise.resolve([
    { id: '1', type: 'EMPLOYEE_CREATED', message: 'New employee added', timestamp: '2024-01-15T10:00:00Z' },
    { id: '2', type: 'LEAVE_APPROVED', message: 'Leave request approved', timestamp: '2024-01-15T09:30:00Z' },
  ])),
}));

describe('Dashboard', () => {
  it('renders dashboard correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('displays dashboard statistics', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });

  it('shows employee count card', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/total employees/i)).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('shows attendance statistics', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/present today/i)).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  it('displays recent activity', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
      expect(screen.getByText('New employee added')).toBeInTheDocument();
    });
  });

  it('refreshes data on refresh button click', async () => {
    const { getDashboardStats } = await import('../../services/api');
    
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(getDashboardStats).toHaveBeenCalled();
  });
});
