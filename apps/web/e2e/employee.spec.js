import { test, expect } from '@playwright/test';

test.describe('Employee Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByLabel(/email/i).fill('admin@staffroom.ke');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/dashboard/);
  });

  test('should navigate to employee list', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await expect(page).toHaveURL(/employees/);
    await expect(page.getByText(/employees/i)).toBeVisible();
  });

  test('should display employee table', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should search for employees', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await page.getByPlaceholderText(/search employees/i).fill('John');
    await page.keyboard.press('Enter');
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should open employee details on row click', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await page.getByText('John Doe').click();
    await expect(page.getByText(/employee details/i)).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should create new employee', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await page.getByRole('button', { name: /add employee/i }).click();
    
    await page.getByLabel(/first name/i).fill('Test');
    await page.getByLabel(/last name/i).fill('Employee');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/department/i).selectOption('Engineering');
    await page.getByLabel(/position/i).selectOption('Software Engineer');
    
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByText(/employee created successfully/i)).toBeVisible();
  });

  test('should edit existing employee', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await page.getByText('John Doe').click();
    await page.getByRole('button', { name: /edit/i }).click();
    
    await page.getByLabel(/first name/i).fill('John Updated');
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByText(/employee updated successfully/i)).toBeVisible();
  });

  test('should delete employee with confirmation', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await page.getByText('John Doe').click();
    await page.getByRole('button', { name: /delete/i }).click();
    
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
    
    await expect(page.getByText(/employee deleted successfully/i)).toBeVisible();
  });

  test('should filter employees by department', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await page.getByRole('combobox', { name: /department/i }).selectOption('Engineering');
    await expect(page.getByText('John Doe')).toBeVisible();
  });
});
