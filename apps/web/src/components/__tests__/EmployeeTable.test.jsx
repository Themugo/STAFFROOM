import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeTable from '../EmployeeTable';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getEmployees: vi.fn(() => Promise.resolve([
    { id: '1', name: 'John Doe', email: 'john@example.com', department: 'Engineering', status: 'ACTIVE' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', department: 'HR', status: 'ACTIVE' },
  ])),
  deleteEmployee: vi.fn(() => Promise.resolve()),
}));

describe('EmployeeTable', () => {
  it('renders employee table correctly', () => {
    render(<EmployeeTable />);
    
    expect(screen.getByText(/employees/i)).toBeInTheDocument();
  });

  it('displays employee data', async () => {
    const { getEmployees } = await import('../../services/api');
    
    render(<EmployeeTable />);

    await screen.findByText('John Doe');
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('filters employees by search term', async () => {
    render(<EmployeeTable />);

    await screen.findByText('John Doe');

    const searchInput = screen.getByPlaceholderText(/search employees/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('opens employee details on row click', async () => {
    render(<EmployeeTable />);

    await screen.findByText('John Doe');

    const johnRow = screen.getByText('John Doe');
    fireEvent.click(johnRow);

    expect(screen.getByText(/employee details/i)).toBeInTheDocument();
  });

  it('shows delete confirmation dialog', async () => {
    render(<EmployeeTable />);

    await screen.findByText('John Doe');

    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });
});
