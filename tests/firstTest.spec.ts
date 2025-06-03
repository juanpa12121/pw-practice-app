import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
});

test.describe("Suite1", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'Light' }).click();
    });

    test("Click Dark", async ({ page }) => {
        await page.getByText("Dark").click();
    });

    test("Click Cosmic", async ({ page }) => {
        await page.getByText("Cosmic").click();
    });
});

test.describe("Suite2", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Auth").click();
    });

    test("Login", async ({ page }) => {
        await page.getByText("Login").click();
        await page.getByPlaceholder("Email address").fill("admin");
        await page.getByPlaceholder("Password").fill("admin");

    });

    test("Register", async ({ page }) => {
        await page.getByText("Register").click();
        await page.getByPlaceholder("Full name").fill("Pedro Perez");
        await page.getByPlaceholder("Email address").fill("admin@example.com");
        await page.locator("#input-password").fill("admin");
        await page.getByPlaceholder("Confirm password").fill("admin");
    });
});

test.describe("Suite3", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click();
    });

    test("The first test1", async ({ page }) => {
        await page.getByText("Form Layouts").click();
    });

    test("Navigate to datepicker page1", async ({ page }) => {
        await page.getByText("Datepicker").click();
    });
});
