import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for key application routes
 * 
 * Tests full-page screenshots for:
 * - Landing page
 * - Onboarding flow pages  
 * - Dashboard
 * - Debug/development pages
 */

test.describe('Page Visual Regression Tests', () => {
  test('Landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('landing-page.png', {fullPage: true});
  });

  test('Onboarding home', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('onboarding-home.png', {fullPage: true});
  });

  test('Onboarding create household', async ({ page }) => {
    await page.goto('/onboarding/create');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('onboarding-create.png', {fullPage: true});
  });

  test('Onboarding join household', async ({ page }) => {
    await page.goto('/onboarding/join');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('onboarding-join.png', {fullPage: true});
  });

  test('Onboarding invite others', async ({ page }) => {
    await page.goto('/onboarding/invite');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('onboarding-invite.png', {fullPage: true});
  });

  test('Onboarding success', async ({ page }) => {
    await page.goto('/onboarding/success');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('onboarding-success.png', {fullPage: true});
  });

  test('Dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard.png', {fullPage: true});
  });

  test('Debug kitchen sink', async ({ page }) => {
    await page.goto('/debug/kitchen-sink');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('debug-kitchen-sink.png', {fullPage: true, timeout: 10000});
  });

  test('Debug layouts', async ({ page }) => {
    await page.goto('/debug/layout');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('debug-layouts.png', {fullPage: true});
  });
});