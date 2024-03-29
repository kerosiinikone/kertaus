import { expect, test } from "@playwright/test";

test("Navigating to /me should show login form without access_token", async ({
  page,
}) => {
  await page.context().clearCookies();

  await page.goto(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/me`
  );

  const loginForm = page.locator("#login-container");

  await expect(loginForm).toBeVisible();
});

test("Navigating to /me should show a profile page with access_token", async () => {});
