import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Forms Layout page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test('Input fields', async ({ page }) => {
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
    //await usingTheGridEmailInput.fill('test@test.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially('test@test.com', {delay: 200})

    //Generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual('test@test.com');

    //Locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test@test.com');
  });

  test('Radio Buttons', async ({ page }) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"});
    //await usingTheGridForm.getByLabel('Option 1').check({force: true});
    await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true});
    const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked();
    expect(radioStatus).toBeTruthy();
    //Assertion with await
    await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked();

    //Validate that Option 2 is checked and Option1 is unchecked
    await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true});
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy();
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy();

  })
  
  
});
