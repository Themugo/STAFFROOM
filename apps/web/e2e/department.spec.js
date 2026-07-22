import { test, expect } from '@playwright/test';

test.describe('Department Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByLabel(/email/i).fill('admin@staffroom.ke');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL(/dashboard/);
  });

  test('should navigate to department section', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await expect(page).toHaveURL(/departments/);
    await expect(page.getByText(/departments/i)).toBeVisible();
  });

  test('should display department tree', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await expect(page.getByText('Engineering')).toBeVisible();
    await expect(page.getByText('HR')).toBeVisible();
  });

  test('should expand department on click', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await page.getByText('Engineering').click();
    await expect(page.getByText('Frontend Team')).toBeVisible();
    await expect(page.getByText('Backend Team')).toBeVisible();
  });

  test('should display employee count for departments', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await expect(page.getByText('25')).toBeVisible();
  });

  test('should search departments', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await page.getByPlaceholderText(/search departments/i).fill('Frontend');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Frontend Team')).toBeVisible();
  });

  test('should create new department', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await page.getByRole('button', { name: /add department/i }).click();
    
    await page.getByLabel(/department name/i).fill('Marketing');
    await page.getByLabel(/description/i).fill('Marketing team');
    await page.getByLabel(/head of department/i).selectOption('John Doe');
    
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByText(/department created successfully/i)).toBeVisible();
  });

  test('should edit department', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await page.getByText('Engineering').click();
    await page.getByRole('button', { name: /edit/i }).click();
    
    await page.getByLabel(/department name/i).fill('Engineering Updated');
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByText(/department updated successfully/i)).toBeVisible();
  });

  test('should delete department with confirmation', async ({ page }) => {
    await page.getByRole('link', { name: /departments/i }).click();
    await page.getByText('HR').click();
    await page.getByRole('button', { name: /delete/i }).click();
    
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
    
    await expect(page.getByText(/department deleted successfully/i)).toBeVisible();
  });
});
