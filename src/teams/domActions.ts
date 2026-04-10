import { Locator, Page } from 'playwright';

export async function firstVisible(page: Page, selectors: readonly string[]): Promise<Locator | null> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }

  return null;
}

export async function clickIfVisible(page: Page, selectors: readonly string[]): Promise<boolean> {
  const locator = await firstVisible(page, selectors);
  if (!locator) return false;
  await locator.click().catch(() => undefined);
  return true;
}

export async function fillIfVisible(page: Page, selectors: readonly string[], value: string): Promise<boolean> {
  const locator = await firstVisible(page, selectors);
  if (!locator) return false;
  await locator.fill(value).catch(() => undefined);
  return true;
}

export async function setPressedState(page: Page, selectors: readonly string[], desiredPressed: boolean): Promise<boolean> {
  const locator = await firstVisible(page, selectors);
  if (!locator) return false;

  const pressed = await locator.getAttribute('aria-pressed').catch(() => null);
  if (pressed === null) {
    return false;
  }

  const isPressed = pressed === 'true';
  if (isPressed !== desiredPressed) {
    await locator.click().catch(() => undefined);
  }

  return true;
}
