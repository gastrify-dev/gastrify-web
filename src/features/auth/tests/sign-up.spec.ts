import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-up");
});

test("Sign-up page loads", async ({ page }) => {
  await expect(page).toHaveTitle(/.*Registrarse/);
  await expect(page.getByRole("heading", { name: "Regístrate" })).toBeVisible();
});

test("Sign-up form loads", async ({ page }) => {
  await expect(page.getByText("Nombre completo")).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Nombre completo" }),
  ).toBeVisible();
  await expect(page.getByText("Número de cédula")).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Número de cédula" }),
  ).toBeVisible();
  await expect(page.getByText("Correo electrónico")).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Correo electrónico" }),
  ).toBeVisible();
  await expect(page.getByText("Contraseña")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Contraseña" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Regístrate" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();
});

test("Sign-up form validation", async ({ page }) => {
  await page.getByRole("button", { name: "Regístrate" }).click();
  await expect(
    page.getByText("Name must be at least 2 characters long"),
  ).toBeVisible();
  await expect(
    page.getByText("Identification number must be 10 characters long"),
  ).toBeVisible();
  await expect(
    page.getByText("Email must be a valid email address"),
  ).toBeVisible();
  await expect(
    page.getByText("Password must be at least 8 characters long"),
  ).toBeVisible();
});
