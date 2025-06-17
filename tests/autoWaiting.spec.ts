import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("Auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  //await successButton.click();

  //const text = await successButton.textContent();
 // await successButton.waitFor({state: "attached"});
  //const text = await successButton.allTextContents();
  //expect(text).toContain('Data loaded with AJAX get request.')
  //override timeout
  await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
});

test('Alternative waits', async({page}) =>{
  const successButton = page.locator(".bg-success");

  //__ Wait for elements
  //await page.waitForSelector('.bg-success');

  // __ Wait for particular response (example for API)
  //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

  // __ Wait for network calls to be completed ('NOT RECOMENDED')
  await page.waitForLoadState('networkidle');

  const text = await successButton.allTextContents();
  expect(text).toContain('Data loaded with AJAX get request.')
});

test('timeouts', async({page}) =>{
  //test.setTimeout(10000)
  //Cuando se llama a test.slow() dentro de una prueba, Playwright multiplica el tiempo de espera (test timeout) por un factor predeterminado, que suele ser 3 veces más.

  test.slow();
  const successButton = page.locator(".bg-success");
  //override timeout
  await successButton.click({timeout: 16000});
});

