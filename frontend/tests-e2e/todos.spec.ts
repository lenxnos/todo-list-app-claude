import { test, expect } from '@playwright/test';

const TEST_PASSWORD = 'test123456';

async function loginAsNewUser(page: import('@playwright/test').Page) {
  const email = `e2e-todo-${Date.now()}@test.com`;

  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Contraseña$/).fill(TEST_PASSWORD);
  await page.getByLabel(/Confirmar/).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /registrarse/i }).click();
  await expect(page).toHaveURL(/login/);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Contraseña').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /ingresar/i }).click();
  await expect(page).toHaveURL('/');
}

test.describe('Todos', () => {
  test('should create a todo with title and description', async ({ page }) => {
    await loginAsNewUser(page);

    await page.getByPlaceholder(/título/i).fill('My first todo');
    await page.getByPlaceholder(/descripción/i).fill('A description');
    await page.getByRole('button', { name: /agregar/i }).click();

    await expect(page.getByText('My first todo')).toBeVisible();
    await expect(page.getByText('A description')).toBeVisible();
  });

  test('should mark a todo as completed and show undo toast', async ({ page }) => {
    await loginAsNewUser(page);

    // Create a todo
    await page.getByPlaceholder(/título/i).fill('Complete me');
    await page.getByRole('button', { name: /agregar/i }).click();
    await expect(page.getByText('Complete me')).toBeVisible();

    // Mark as completed
    await page.getByRole('checkbox').click();

    // Undo toast should appear
    await expect(page.getByText(/tarea completada/i)).toBeVisible();
    await expect(page.getByText(/deshacer/i)).toBeVisible();
  });

  test('should show completed todos when filter is toggled', async ({ page }) => {
    await loginAsNewUser(page);

    // Create and complete a todo
    await page.getByPlaceholder(/título/i).fill('Will be completed');
    await page.getByRole('button', { name: /agregar/i }).click();
    await expect(page.getByText('Will be completed')).toBeVisible();

    // Mark as completed and wait for toast to dismiss
    await page.getByRole('checkbox').click();
    await page.waitForTimeout(6000); // Wait for toast + API call

    // Toggle filter to show completed
    await page.getByLabel(/mostrar finalizados/i).click();

    // Should see the completed todo
    await expect(page.getByText('Will be completed')).toBeVisible();
  });

  test('should delete a todo', async ({ page }) => {
    await loginAsNewUser(page);

    await page.getByPlaceholder(/título/i).fill('Delete me');
    await page.getByRole('button', { name: /agregar/i }).click();
    await expect(page.getByText('Delete me')).toBeVisible();

    // Click delete button (trash icon)
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click();

    await expect(page.getByText('Delete me')).not.toBeVisible();
  });
});
