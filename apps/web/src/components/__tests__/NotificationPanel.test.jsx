import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationPanel from '../NotificationPanel';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getNotifications: vi.fn(() => Promise.resolve([
    { id: '1', type: 'INFO', title: 'New Policy', message: 'Updated HR policies', read: false, createdAt: '2024-01-15T10:00:00Z' },
    { id: '2', type: 'WARNING', title: 'Leave Balance', message: 'Leave balance low', read: true, createdAt: '2024-01-14T09:30:00Z' },
    { id: '3', type: 'SUCCESS', title: 'Request Approved', message: 'Leave request approved', read: false, createdAt: '2024-01-13T08:00:00Z' },
  ])),
  markNotificationAsRead: vi.fn(() => Promise.resolve()),
  markAllNotificationsAsRead: vi.fn(() => Promise.resolve()),
}));

describe('NotificationPanel', () => {
  it('renders notification panel correctly', () => {
    render(<NotificationPanel />);
    
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });

  it('displays notification list', async () => {
    render(<NotificationPanel />);

    await waitFor(() => {
      expect(screen.getByText('New Policy')).toBeInTheDocument();
      expect(screen.getByText('Leave Balance')).toBeInTheDocument();
    });
  });

  it('shows unread notification count', async () => {
    render(<NotificationPanel />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('filters notifications by type', async () => {
    render(<NotificationPanel />);

    await screen.findByText('New Policy');

    const filterButton = screen.getByRole('button', { name: /unread/i });
    fireEvent.click(filterButton);

    expect(screen.getByText('New Policy')).toBeInTheDocument();
    expect(screen.queryByText('Leave Balance')).not.toBeInTheDocument();
  });

  it('marks notification as read on click', async () => {
    const { markNotificationAsRead } = await import('../../services/api');
    
    render(<NotificationPanel />);

    await screen.findByText('New Policy');

    const notificationItem = screen.getByText('New Policy');
    fireEvent.click(notificationItem);

    await waitFor(() => {
      expect(markNotificationAsRead).toHaveBeenCalledWith('1');
    });
  });

  it('marks all notifications as read', async () => {
    const { markAllNotificationsAsRead } = await import('../../services/api');
    
    render(<NotificationPanel />);

    await screen.findByText('New Policy');

    const markAllButton = screen.getByRole('button', { name: /mark all as read/i });
    fireEvent.click(markAllButton);

    await waitFor(() => {
      expect(markAllNotificationsAsRead).toHaveBeenCalled();
    });
  });

  it('shows notification details on click', async () => {
    render(<NotificationPanel />);

    await screen.findByText('New Policy');

    const notificationItem = screen.getByText('New Policy');
    fireEvent.click(notificationItem);

    expect(screen.getByText('Updated HR policies')).toBeInTheDocument();
  });

  it('displays notification type icons', async () => {
    render(<NotificationPanel />);

    await screen.findByText('New Policy');

    const infoIcon = screen.getByTestId('info-icon');
    const warningIcon = screen.getByTestId('warning-icon');
    const successIcon = screen.getByTestId('success-icon');

    expect(infoIcon).toBeInTheDocument();
    expect(warningIcon).toBeInTheDocument();
    expect(successIcon).toBeInTheDocument();
  });
});
