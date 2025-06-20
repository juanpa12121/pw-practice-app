import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Forms Layout page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("Input fields", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });
    //await usingTheGridEmailInput.fill('test@test.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test@test.com", {
      delay: 200,
    });

    //Generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test@test.com");

    //Locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test@test.com");
  });

  test("Radio Buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    //await usingTheGridForm.getByLabel('Option 1').check({force: true});
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });
    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked();
    expect(radioStatus).toBeTruthy();
    //Assertion with await
    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" })
    ).toBeChecked();

    //Validate that Option 2 is checked and Option1 is unchecked
    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked()
    ).toBeFalsy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked()
    ).toBeTruthy();
  });
});

test("checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true });
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });
  await page
    .getByRole("checkbox", { name: "Show toast with icon" })
    .uncheck({ force: true });

  const allBoxes = page.getByRole("checkbox");
  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });
    expect(await box.isChecked()).toBeFalsy();
  }

  for (const box of await allBoxes.all()) {
    await box.check({ force: true });
    expect(await box.isChecked()).toBeTruthy();
  }
});

test("Lists and dropdowns", async ({ page }) => {
  const dropDownMenu = page.locator("ngx-header nb-select");
  await dropDownMenu.click();

  page.getByRole("list"); //When the list has a UL tag
  page.getByRole("listitem"); //When the list has LI tag

  //const optionList = page.getByRole('list').locator('nb-option');
  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  await optionList.filter({ hasText: "Cosmic" }).click();
  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  for (const color in colors) {
    await dropDownMenu.click();
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
  }
});

test("Tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  page.getByRole("tooltip"); //If you have a role tooltip created
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("Dialog Box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();
  await expect(page.locator("tbody tr").first()).not.toContainText(
    "mdo@gmail.com"
  );

  const rows = page.locator("tbody tr");
  for (const row of await rows.all()) {
    await expect(row).not.toContainText("mdo@gmail.com");
  }
});

test("Web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  //1 get the row by any test in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("30");
  await page.locator(".nb-checkmark").click();

  //2 Get the row based on the value in the specific column
  await page.getByRole("link", { name: "2" }).click();
  await page.locator("span", { hasText: "2" }).first().click();
  await page.locator("span.ng2-smart-page-link", { hasText: "2" }).click();

  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page.locator("input-editor").getByPlaceholder("E-mail").fill("test@test.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  //3. Test filter of the table
  const ages = ["20", "30", "40", "200"];
  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    // await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    // await page.waitForTimeout(500);
    await page.locator("input-filter").getByPlaceholder("Age").pressSequentially(age, { delay: 500 });
    const ageRows = page.locator("tbody tr");

    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();
      if (age == "200") {
        expect(await page.getByRole('table').textContent()).toContain("No data found");
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }

});

test('Datepicker', async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 200); // Set to tomorrow's date
  const expectedDate = date.getDate().toString();

  const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
  const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
  const expectedYear = date.getFullYear().toString();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
    //Click on the next month button until the expected month and year is displayed
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    //console.log(calendarMonthAndYear);
  }

  //The best way to select the dates in the date Picker is first to identify a unique locator that represent the list of the date cells that you want to select for the current month.
  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click();
  await expect(calendarInputField).toHaveValue(dateToAssert);
});

test('Sliders', async ({ page }) => {
  //Update attibute
  const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
  await tempGauge.evaluate(node => {
    node.setAttribute('cx', '232.630');
    node.setAttribute('cy', '232.630');
  });
  await tempGauge.click();
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
  await tempBox.scrollIntoViewIfNeeded();
  await expect(tempBox).toContainText('30');

  //Mouse movement
  // const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
  // await tempBox.scrollIntoViewIfNeeded();

  // //define a bounding box
  // const box = await tempBox.boundingBox();
  // const x = box.x + box.width / 2; // Center of the box
  // const y = box.y + box.height / 2; // Center of the box
  // await page.mouse.move(x, y);
  // await page.mouse.down();
  // await page.mouse.move(x+100, y);
  // await page.mouse.move(x+100, y+100);
  // await page.mouse.up();
  // await expect(tempBox).toContainText('30');

});


