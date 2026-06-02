import { test, expect } from '@playwright/test';

test.describe('Add Experience', () => {
  test('should navigate to profile and open add experience dialog', async ({ page }) => {
    await page.goto('/');

    // Click on "Go to Profile" button
    await page.getByRole('link', { name: /go to profile/i }).click();

    // Wait for navigation
    await page.waitForURL('/profile');

    // Verify we're on the profile page
    await expect(page.getByRole('heading', { name: /core profile/i })).toBeVisible();

    // Click the Add Experience button
    await page.getByRole('button', { name: /add experience/i }).click();

    // Verify dialog is open
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /add work experience/i })).toBeVisible();
  });

  test('should fill out and submit experience form', async ({ page }) => {
    await page.goto('/profile');

    // Open the dialog
    await page.getByRole('button', { name: /add experience/i }).click();

    // Fill out the form
    await page.getByLabel(/company/i).fill('Test Company');
    await page.getByLabel(/^role/i).fill('Software Engineer');
    await page.getByLabel(/location/i).fill('San Francisco, CA');
    await page.getByLabel(/start date/i).fill('2020-01-01');
    await page.getByLabel(/description/i).fill('Working on exciting projects');

    // Submit the form
    await page.getByRole('button', { name: /add experience/i, exact: true }).click();

    // Wait for dialog to close and data to be added
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Verify the experience was added (should see it in the list)
    await expect(page.getByText('Software Engineer')).toBeVisible();
    await expect(page.getByText('Test Company')).toBeVisible();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    await page.goto('/profile');

    // Open the dialog
    await page.getByRole('button', { name: /add experience/i }).click();

    // Try to submit without filling required fields
    await page.getByRole('button', { name: /add experience/i, exact: true }).click();

    // Verify validation errors appear
    await expect(page.getByText(/company is required/i)).toBeVisible();
    await expect(page.getByText(/role is required/i)).toBeVisible();
  });

  test('should cancel and close dialog', async ({ page }) => {
    await page.goto('/profile');

    // Open the dialog
    await page.getByRole('button', { name: /add experience/i }).click();

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
