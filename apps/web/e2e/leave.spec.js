import { test, expect } from '@playwright/test';

test.describe('Leave Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByLabel(/email/i).fill('admin@staffroom.ke');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/dashboard/);
  });

  test('should navigate to leave management', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await expect(page).toHaveURL(/leave/);
    await expect(page.getByText(/leave management/i)).toBeVisible();
  });

  test('should display leave balance', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await expect(page.getByText(/annual leave/i)).toBeVisible();
    await expect(page.getByText('20')).toBeVisible();
  });

  test('should create new leave request', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await page.getByRole('button', { name: /request leave/i }).click();
    
    await page.getByLabel(/leave type/i).selectOption('ANNUAL');
    await page.getByLabel(/start date/i).fill('2024-03-01');
    await page.getByLabel(/end date/i).fill('2024-03-05');
    await page.getByLabel(/reason/i).fill('Family vacation');
    
    await page.getByRole('button', { name: /submit/i }).click();
    
    await expect(page.getByText(/leave request submitted/i)).toBeVisible();
  });

  test('should show leave duration calculation', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await page.getByRole('button', { name: /request leave/i }).click();
    
    await page.getByLabel(/start date/i).fill('2024-03-01');
    await page.getByLabel(/end date/i).fill('2024-03-05');
    
    await expect(page.getByText(/5 days/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await page.getByRole('button', { name: /request leave/i }).click();
    
    await page.getByRole('button', { name: /submit/i }).click();
    
    await expect(page.getByText(/leave type is required/i)).toBeVisible();
    await expect(page.getByText(/start date is required/i)).toBeVisible();
  });

  test('should show error for insufficient leave balance', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await page.getByRole('button', { name: /request leave/i }).click();
    
    await page.getByLabel(/leave type/i).selectOption('ANNUAL');
    await page.getByLabel(/start date/i).fill('2024-03-01');
    await page.getByLabel(/end date/i).fill('2024-04-30'); // 30 days
    
    await page.getByRole('button', { name: /submit/i }).click();
    
    await expect(page.getByText(/insufficient leave balance/i)).toBeVisible();
  });

  test('should display leave history', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await page.getByRole('tab', { name: /history/i }).click();
    
    await expect(page.getByText(/past leave requests/i)).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should cancel leave request', async ({ page }) => {
    await page.getByRole('link', { name: /leave/i }).click();
    await page.getByRole('tab', { name: /pending/i }).click();
    
    const cancelButton = page.getByRole('button', { name: /cancel/i }).first();
    await cancelButton.click();
    
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
    
    await expect(page.getByText(/leave request cancelled/i)).toBeVisible();
  });
});
