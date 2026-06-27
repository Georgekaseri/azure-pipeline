import { Locator, Page } from "@playwright/test";

export type ElementType = "input" | "button" | "dropdown";

type LocatorStrategy =
  | { by: "placeholder"; value: string; type: ElementType }
  | { by: "role"; role: "button" | "textbox" | "combobox"; name: string; type: ElementType };

const loginLocatorMap: Record<string, LocatorStrategy> = {
  username: { by: "placeholder", value: "Enter your username", type: "input" },
  password: { by: "placeholder", value: "Enter your password", type: "input" },
  login: { by: "role", role: "button", name: "Login", type: "button" },
  location: { by: "role", role: "combobox", name: "Location *", type: "dropdown" },
  continue: { by: "role", role: "button", name: "Continue", type: "button" }
};

export function getMappedElementType(elementKey: string): ElementType {
  const strategy = loginLocatorMap[elementKey];

  if (!strategy) {
    throw new Error(`Unsupported element key: ${elementKey}`);
  }

  return strategy.type;
}

export function getMappedLocator(page: Page, elementKey: string): Locator {
  const strategy = loginLocatorMap[elementKey];

  if (!strategy) {
    throw new Error(`Unsupported element key: ${elementKey}`);
  }

  if (strategy.by === "placeholder") {
    return page.getByPlaceholder(strategy.value);
  }

  return page.getByRole(strategy.role, { name: strategy.name });
}
