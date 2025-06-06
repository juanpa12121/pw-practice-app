import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
  //by Tag name
  await page.locator("input").first().click();

  //by ID
  await page.locator("#inputEmail1").click();

  //by Class value
  page.locator(".shape-rectangle");

  //by attribute
  page.locator('[placeholder="Email"]');

  //by Class value (full)
  page.locator(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
  );

  //combine different selectors
  page.locator('input[placeholder="Email"][nbinput]');

  //by XPath (NOT RECOMMENDED)
  page.locator('//*[@id="inputEmail1"]');

  //by partial text match
  page.locator(':text("Using")');

  //by exact text match
  page.locator(':text-is("Using the Grid")');
});

test("User facing Locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();
  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").click();
  await page.getByText("Using the Grid").click();
  await page.getByTestId("SignIn").click();
  await page.getByTestId("SignIn").click();
  await page.getByTitle("IoT Dashboard").click();
});

test('Locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click();
    //Elements by index
    await page.locator('nb-card').nth(3).getByRole('button').click();
});

test('Locating parent elements', async ({ page }) => {
   await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'}).click();
   await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: 'Email'}).click();

   await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name: 'Email'}).click();
   await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Email'}).click();

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
  .getByRole('textbox', {name: 'Email'}).click();
//locator('..')Esto sube un nivel en el DOM. Es decir, accedes al elemento padre del elemento localizado.
  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click();

// Prefiere locator('selector', {has, hasText}) cuando puedes ubicar el elemento directamente.
// Usa .filter() si ya tienes un conjunto de elementos y necesitas reducirlo.
// Usa locator('..') si necesitas subir un nivel en el DOM desde un hijo bien definido.
});

test('Reusing locators', async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"});
  const emailField = basicForm.getByRole('textbox', {name: 'Email'});
  const passwordField = basicForm.getByRole('textbox', {name: 'Password'});

  await emailField.fill("test@test.com");
  await passwordField.fill("test123");
  await basicForm.locator('nb-checkbox').click();
  await basicForm.getByRole('button').click();

  await expect(emailField).toHaveValue("test@test.com");
  await expect(passwordField).toHaveValue("test123");
});