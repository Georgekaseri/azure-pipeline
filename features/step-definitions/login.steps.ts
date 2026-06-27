import { Given, Then, When } from "@cucumber/cucumber";
import { LoginPage } from "../../pages/login.page";
import { assertNotOnPath, assertOnPath, assertUrlContains } from "../../helpers/assertion.helper";
import { getRequiredEnv, resolveConfigValue, resolveUrl } from "../../helpers/env.helper";
import { getMappedElementType } from "../../helpers/locator.helper";
import { CustomWorld } from "../../support/world";

Given("I open the application url {string}", async function (this: CustomWorld, urlKey: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(resolveUrl(urlKey));
});

Then("the {string} input should be visible", async function (this: CustomWorld, fieldKey: string) {
  if (getMappedElementType(fieldKey) !== "input") {
    throw new Error(`Element ${fieldKey} is not configured as an input.`);
  }

  const loginPage = new LoginPage(this.page);
  await loginPage.assertElementVisible(fieldKey);
});

Then("the {string} button should be visible", async function (this: CustomWorld, buttonKey: string) {
  if (getMappedElementType(buttonKey) !== "button") {
    throw new Error(`Element ${buttonKey} is not configured as a button.`);
  }

  const loginPage = new LoginPage(this.page);
  await loginPage.assertElementVisible(buttonKey);
});

Then("the page url should contain {string}", async function (this: CustomWorld, expectedUrlPart: string) {
  await assertUrlContains(this.page, resolveConfigValue(expectedUrlPart));
});

When("I enter credential {string} into {string}",
  async function (this: CustomWorld, envKey: string, fieldKey: string) {
    if (getMappedElementType(fieldKey) !== "input") {
      throw new Error(`Element ${fieldKey} is not configured as an input.`);
    }

    const loginPage = new LoginPage(this.page);
    await loginPage.fillElement(fieldKey, getRequiredEnv(envKey));
  }
);

When("I click the {string} button", async function (this: CustomWorld, buttonKey: string) {
  if (getMappedElementType(buttonKey) !== "button") {
    throw new Error(`Element ${buttonKey} is not configured as a button.`);
  }

  const loginPage = new LoginPage(this.page);
  await loginPage.clickElement(buttonKey);
});

When("I select option {string} from {string}",async function (this: CustomWorld, optionLabel: string, fieldKey: string) {
    if (getMappedElementType(fieldKey) !== "dropdown") {
      throw new Error(`Element ${fieldKey} is not configured as a dropdown.`);
    }

    const loginPage = new LoginPage(this.page);
    await loginPage.selectElementOption(fieldKey, optionLabel);
  }
);

Then("login should succeed away from {string}", async function (this: CustomWorld, disallowedPath: string) {
  await assertNotOnPath(this.page, disallowedPath);
});

Then("login should reach path {string}", async function (this: CustomWorld, expectedPath: string) {
  await assertOnPath(this.page, expectedPath);
});
