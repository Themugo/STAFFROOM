import { test, expect } from '@playwright/test';

test.describe('Attendance Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByLabel(/email/i).fill('admin@staffroom.ke');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/dashboard/);
  });

  test('should navigate to attendance section', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page).toHaveURL(/attendance/);
    await expect(page.getByText(/attendance/i)).toBeVisible();
  });

  test('should display attendance calendar', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page.getByRole('grid')).toBeVisible();
  });

  test('should display attendance statistics', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page.getByText(/present/i)).toBeVisible();
    await expect(page.getByText(/absent/i)).toBeVisible();
  });

  test('should navigate between months', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    const nextMonthButton = page.getByRole('button', { name: /next month/i });
    await nextMonthButton.click();
    await expect(page.getByText('February')).toBeVisible();
  });

  test('should check in successfully', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    
    const todayCell = page.getByText(new Date().getDate().toString()).first();
    await todayCell.click();
    
    await page.getByRole('button', { name: /check in/i }).click();
    
    await expect(page.getByText(/checked in successfully/i)).toBeVisible();
  });

  test('should check out successfully', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    
    const todayCell = page.getByText(new Date().getDate().toString()).first();
    await todayCell.click();
    
    await page.getByRole('button', { name: /check out/i }).click();
    
    await expect(page.getByText(/checked out successfully/i)).toBeVisible();
  });

  test('should display attendance status indicators', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page.getByTestId('present-indicator')).toBeVisible();
    await expect(page.getByTestId('absent-indicator')).toBeVisible();
  });

  test('should filter attendance by status', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    await page.getByRole('button', { name: /filter/i }).click();
    await page.getByRole('button', { name: /present/i }).click();
    await expect(page.getByText('15')).toBeVisible();
  });

  test('should show attendance details on date click', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    const dateCell = page.getByText('15').first();
    await dateCell.click();
    await expect(page.getByText(/attendance details/i)).toBeVisible();
  });
});
