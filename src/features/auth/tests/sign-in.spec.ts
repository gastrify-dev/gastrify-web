import { expect, Page, test } from "@playwright/test";

async function login(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("/home");
}

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-in");
});

test("Sign-in page loads", async ({ page }) => {
  await expect(page).toHaveTitle(/.*Iniciar sesión/);
  await expect(
    page.getByRole("heading", { name: "Iniciar Sesión" }),
  ).toBeVisible();
});

test("Sign-in form loads", async ({ page }) => {
  await expect(page.getByText("Correo electrónico")).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Correo electrónico" }),
  ).toBeVisible();
  await expect(page.getByText("Contraseña")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Contraseña" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Iniciar sesión" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Regístrate" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enlace Mágico" }),
  ).toBeVisible();
});

test("Sign-in form validation", async ({ page }) => {
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(
    page.getByText("Email must be a valid email address"),
  ).toBeVisible();
  await expect(
    page.getByText("Password must be at least 8 characters long"),
  ).toBeVisible();
});

test("Sign-in with valid credentials", async ({ page }) => {
  await page.getByLabel("Correo electrónico").fill(process.env.TEST_EMAIL!);
  await page.getByLabel("Contraseña").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("/home");
});

test("UI is different for Admin and User", async ({ browser }) => {
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  await login(
    adminPage,
    process.env.TEST_ADMIN_EMAIL!,
    process.env.TEST_ADMIN_PASSWORD!,
  );
  await expect(adminPage.getByRole("link", { name: "Admin" })).toBeVisible();
  await adminContext.close();

  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  await login(userPage, process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
  await expect(userPage.getByRole("link", { name: "Admin" })).not.toBeVisible();
  await userContext.close();
});
