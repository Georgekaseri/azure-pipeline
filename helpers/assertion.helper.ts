import { expect, Page } from "@playwright/test";

export async function assertUrlContains(page: Page, expectedValue: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(expectedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

export async function assertNotOnPath(page: Page, disallowedPathPart: string): Promise<void> {
  await page.waitForLoadState("domcontentloaded");

  await expect
    .poll(() => {
      const currentUrl = new URL(page.url());
      return currentUrl.hash;
    }, {
      timeout: 15000,
      message: `Expected to navigate away from ${disallowedPathPart}`
    })
    .not.toBe(disallowedPathPart);
}

export async function assertOnPath(page: Page, expectedPathPart: string): Promise<void> {
  await page.waitForLoadState("domcontentloaded");

  await expect
    .poll(() => {
      const currentUrl = new URL(page.url());
      return currentUrl.hash;
    }, {
      timeout: 15000,
      message: `Expected to navigate to ${expectedPathPart}`
    })
    .toBe(expectedPathPart);
}
