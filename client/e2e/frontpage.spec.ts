import { test, expect } from "@playwright/test";

test("has header text", async ({ page }) => {
  await page.goto(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");

  const header = page.locator("h1#header-text");

  await expect(header).toBeVisible();
});

test("has user icon", async ({ page }) => {
  await page.goto(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");

  const icon = page.locator("#user-icon");

  await expect(icon).toBeVisible();
});
