import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DepartmentTree from '../DepartmentTree';

// Mock the API calls
vi.mock('../../services/api', () => ({
  getDepartments: vi.fn(() => Promise.resolve([
    { id: '1', name: 'Engineering', parentId: null, employees: 25 },
    { id: '2', name: 'HR', parentId: null, employees: 5 },
    { id: '3', name: 'Frontend Team', parentId: '1', employees: 10 },
    { id: '4', name: 'Backend Team', parentId: '1', employees: 15 },
  ])),
}));

describe('DepartmentTree', () => {
  it('renders department tree correctly', () => {
    render(<DepartmentTree />);
    
    expect(screen.getByText(/departments/i)).toBeInTheDocument();
  });

  it('displays top-level departments', async () => {
    render(<DepartmentTree />);

    await screen.findByText('Engineering');
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
  });

  it('expands department on click', async () => {
    render(<DepartmentTree />);

    await screen.findByText('Engineering');

    const engineeringNode = screen.getByText('Engineering');
    fireEvent.click(engineeringNode);

    await screen.findByText('Frontend Team');
    expect(screen.getByText('Frontend Team')).toBeInTheDocument();
    expect(screen.getByText('Backend Team')).toBeInTheDocument();
  });

  it('displays employee count for departments', async () => {
    render(<DepartmentTree />);

    await screen.findByText('Engineering');
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('filters departments by search term', async () => {
    render(<DepartmentTree />);

    await screen.findByText('Engineering');

    const searchInput = screen.getByPlaceholderText(/search departments/i);
    fireEvent.change(searchInput, { target: { value: 'Frontend' } });

    await screen.findByText('Frontend Team');
    expect(screen.getByText('Frontend Team')).toBeInTheDocument();
  });

  it('shows department details on selection', async () => {
    render(<DepartmentTree />);

    await screen.findByText('Engineering');

    const engineeringNode = screen.getByText('Engineering');
    fireEvent.click(engineeringNode);

    const detailsButton = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsButton);

    expect(screen.getByText(/department details/i)).toBeInTheDocument();
  });
});
