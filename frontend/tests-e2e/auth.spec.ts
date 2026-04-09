import { test, expect } from '@playwright/test';

const TEST_EMAIL = `e2e-${Date.now()}@test.com`;
const TEST_PASSWORD = 'test123456';

test.describe('Authentication', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel(/^Contraseña$/).fill(TEST_PASSWORD);
    await page.getByLabel(/Confirmar/).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /registrarse/i }).click();

    await expect(page).toHaveURL(/login/);
  });

  test('should login with registered user', async ({ page }) => {
    // First register
    await page.goto('/register');
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel(/^Contraseña$/).fill(TEST_PASSWORD);
    await page.getByLabel(/Confirmar/).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /registrarse/i }).click();
    await expect(page).toHaveURL(/login/);

    // Then login
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Contraseña').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /ingresar/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('nonexistent@test.com');
    await page.getByLabel('Contraseña').fill('wrongpassword');
    await page.getByRole('button', { name: /ingresar/i }).click();

    await expect(page.getByText(/invalid|inválido|error/i)).toBeVisible();
  });

  test('should logout', async ({ page }) => {
    // Register and login first
    await page.goto('/register');
    const email = `e2e-logout-${Date.now()}@test.com`;
    await page.getByLabel('Email').fill(email);
    await page.getByLabel(/^Contraseña$/).fill(TEST_PASSWORD);
    await page.getByLabel(/Confirmar/).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /registrarse/i }).click();
    await expect(page).toHaveURL(/login/);

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Contraseña').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /ingresar/i }).click();
    await expect(page).toHaveURL('/');

    // Logout
    await page.getByRole('button', { name: /cerrar sesión/i }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login');
    await page.getByText(/olvidé mi contraseña/i).click();
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.getByText(/recuperar contraseña/i)).toBeVisible();
  });
});
