import { expect, test } from '@playwright/test';

test('bosh sahifa asosiy sarlavha va qidiruvni ko‘rsatadi', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Imkoniyatlar to‘p/i })).toBeVisible();
  await expect(page.getByRole('search')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Asosiy menyu' }).getByRole('link', { name: 'Imkoniyatlar' })).toBeVisible();
});

test('qidiruv so‘rovi URL orqali saqlanadi', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('search').getByRole('searchbox');
  await search.fill('stipendiya e2e');
  await page.getByRole('search').getByRole('button', { name: 'Qidirish' }).click();
  await expect(page).toHaveURL(/\/imkoniyatlar\?q=stipendiya(?:%20|\+)e2e/);
  await expect(page.getByRole('heading', { name: 'Imkoniyatlar' })).toBeVisible();
});

test('tezkor tur chipi imkoniyatlar filtriga olib boradi', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Stipendiya', exact: true }).click();
  await expect(page).toHaveURL(/\/imkoniyatlar\?type=scholarship/);
  await expect(page.getByRole('heading', { name: 'Imkoniyatlar' })).toBeVisible();
});

test('kirish sahifasida magic-link formasi bor', async ({ page }) => {
  await page.goto('/kirish');
  await expect(page.getByRole('heading', { name: 'Kirish' })).toBeVisible();
  await expect(page.getByRole('button', { name: /havola|kirish|yubor/i })).toBeVisible();
});

test('maxfiylik va foydalanish shartlari sahifalari ochiladi', async ({ page }) => {
  await page.goto('/maxfiylik');
  await expect(page.getByRole('heading', { name: /maxfiylik/i })).toBeVisible();
  await page.goto('/shartlar');
  await expect(page.getByRole('heading', { name: /shart/i })).toBeVisible();
});
