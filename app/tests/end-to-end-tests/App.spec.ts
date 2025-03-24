import {test, expect} from '@playwright/test';

test('test', async ({page}) => {
  console.log('Running test');
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('link', {name: 'Home page'})).toBeVisible();
  await page
    .getByRole('link', {
      name: 'Top and bottom view of a snowboard. The top view shows abstract circles and',
    })
    .click();
  await expect(
    page.getByRole('heading', {name: 'The Complete Snowboard'}),
  ).toBeVisible();
  await expect(page.getByRole('button', {name: 'Dawn'})).toBeVisible();
  await page.getByRole('button', {name: 'Dawn'}).click();
  await page.getByRole('button', {name: 'Add to cart'}).click();
  await expect(page.getByRole('heading', {name: 'CART'})).toBeVisible();
  await expect(
    page.getByRole('link', {name: 'Continue to Checkout →'}),
  ).toBeVisible();
  await page.getByRole('link', {name: 'Continue to Checkout →'}).click();
  await expect(page.getByRole('heading', {name: 'Opening soon'})).toBeVisible();
});
