import { expect, Locator, Page } from "@playwright/test";
import { getMappedLocator } from "../helpers/locator.helper";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  }

  getElement(elementKey: string): Locator {
    return getMappedLocator(this.page, elementKey);
  }

  async assertElementVisible(elementKey: string): Promise<void> {
    await expect(this.getElement(elementKey)).toBeVisible();
  }

  async fillElement(elementKey: string, value: string): Promise<void> {
    await this.getElement(elementKey).fill(value);
  }

  async clickElement(elementKey: string): Promise<void> {
    await this.getElement(elementKey).click();
  }

  async selectElementOption(elementKey: string, optionLabel: string): Promise<void> {
    await this.getElement(elementKey).selectOption({ label: optionLabel });
  }
}
