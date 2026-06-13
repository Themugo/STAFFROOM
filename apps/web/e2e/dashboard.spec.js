import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByLabel(/email/i).fill('admin@staffroom.ke');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/dashboard/);
  });

  test('should display dashboard statistics', async ({ page }) => {
    await expect(page.getByText(/total employees/i)).toBeVisible();
    await expect(page.getByText('50')).toBeVisible();
    await expect(page.getByText(/present today/i)).toBeVisible();
    await expect(page.getByText('42')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.getByText(/recent activity/i)).toBeVisible();
    await expect(page.getByText('New employee added')).toBeVisible();
  });

  test('should refresh dashboard data', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await refreshButton.click();
    
    await expect(page.getByText(/data refreshed/i)).toBeVisible();
  });

  test('should navigate to employee section from dashboard', async ({ page }) => {
    await page.getByRole('link', { name: /employees/i }).click();
    await expect(page).toHaveURL(/employees/);
  });

  test('should navigate to leave section from dashboard', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await expect(page).toHaveURL(/leave/);
  });

  test('should navigate to attendance section from dashboard', async ({ page }) => {
    await page.getByRole('link', { name: /attendance/i }).click();
    await expect(page).toHaveURL(/attendance/);
  });

  test('should display attendance chart', async ({ page }) => {
    await expect(page.getByTestId('attendance-chart')).toBeVisible();
  });

  test('should display leave statistics', async ({ page }) => {
    await expect(page.getByText(/pending leaves/i)).toBeVisible();
    await expect(page.getByText('5')).toBeVisible();
  });

  test('should display department distribution', async ({ page }) => {
    await expect(page.getByText(/department distribution/i)).toBeVisible();
    await expect(page.getByTestId('department-chart')).toBeVisible();
  });
});
