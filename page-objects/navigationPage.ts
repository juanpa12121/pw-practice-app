import { Page } from "@playwright/test";

export class NavigationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem("Forms");
        await this.page.getByText("Form Layouts").click();
    }

    async datePickerPage() {
        await this.selectGroupMenuItem("Forms")
        await this.page.waitForTimeout(2000); // Wait for the menu to expand
        await this.page.getByText("Datepicker").click();
    }

    async smartTablePage() {
        await this.selectGroupMenuItem("Tables & Data");
        await this.page.getByText("Smart Table").click();
    }

    async toastrPage() {
        await this.selectGroupMenuItem("Modal & Overlays");
        await this.page.getByText("Toastr").click();
    }

    async tooltipPage() {
        await this.selectGroupMenuItem("Modal & Overlays");
        await this.page.getByText("Tooltip").click();
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');
        if(expandedState === "false")
            await groupMenuItem.click();
    }
}
