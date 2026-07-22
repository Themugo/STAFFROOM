import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AttendanceCalendar from '../AttendanceCalendar';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getAttendance: vi.fn(() => Promise.resolve([
    { id: '1', date: '2024-01-15', status: 'PRESENT', checkIn: '08:00', checkOut: '17:00' },
    { id: '2', date: '2024-01-16', status: 'PRESENT', checkIn: '08:30', checkOut: '17:30' },
    { id: '3', date: '2024-01-17', status: 'ABSENT', checkIn: null, checkOut: null },
  ])),
  checkIn: vi.fn(() => Promise.resolve({ id: '1', status: 'PRESENT' })),
  checkOut: vi.fn(() => Promise.resolve({ id: '1', status: 'PRESENT', checkOut: '17:00' })),
}));

describe('AttendanceCalendar', () => {
  it('renders attendance calendar correctly', () => {
    render(<AttendanceCalendar />);
    
    expect(screen.getByText(/attendance/i)).toBeInTheDocument();
  });

  it('displays calendar view', () => {
    render(<AttendanceCalendar />);
    
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('shows attendance data for dates', async () => {
    render(<AttendanceCalendar />);

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('navigates between months', () => {
    render(<AttendanceCalendar />);
    
    const nextMonthButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextMonthButton);

    expect(screen.getByText('February')).toBeInTheDocument();
  });

  it('shows attendance status indicators', async () => {
    render(<AttendanceCalendar />);

    await waitFor(() => {
      const presentIndicator = screen.getByTestId('present-indicator');
      const absentIndicator = screen.getByTestId('absent-indicator');
      
      expect(presentIndicator).toBeInTheDocument();
      expect(absentIndicator).toBeInTheDocument();
    });
  });

  it('opens check-in dialog on date click', async () => {
    render(<AttendanceCalendar />);

    await screen.findByText('15');

    const dateCell = screen.getByText('15');
    fireEvent.click(dateCell);

    expect(screen.getByText(/check in/i)).toBeInTheDocument();
  });

  it('submits check-in successfully', async () => {
    const { checkIn } = await import('../../services/api');
    
    render(<AttendanceCalendar />);

    await screen.findByText('15');

    const dateCell = screen.getByText('15');
    fireEvent.click(dateCell);

    const checkInButton = screen.getByRole('button', { name: /check in/i });
    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(checkIn).toHaveBeenCalled();
    });
  });

  it('displays attendance statistics', async () => {
    render(<AttendanceCalendar />);

    await waitFor(() => {
      expect(screen.getByText(/present/i)).toBeInTheDocument();
      expect(screen.getByText(/absent/i)).toBeInTheDocument();
    });
  });

  it('filters attendance by status', async () => {
    render(<AttendanceCalendar />);

    await screen.findByText('15');

    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);

    const presentFilter = screen.getByRole('button', { name: /present/i });
    fireEvent.click(presentFilter);

    expect(screen.getByText('15')).toBeInTheDocument();
  });
});
