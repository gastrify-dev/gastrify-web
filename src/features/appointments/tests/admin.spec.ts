import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-in");
  await page
    .getByLabel("Correo electrónico")
    .fill(process.env.TEST_ADMIN_EMAIL!);
  await page.getByLabel("Contraseña").fill(process.env.TEST_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("/home");
});

test("Can create an available appointment and it appears on list", async ({
  page,
}) => {
  await page.goto("/appointments");

  await expect(page.getByRole("button", { name: "Nueva cita" })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByText("No se encontraron eventos")).toBeVisible();
  await page.getByRole("button", { name: "Nueva cita" }).click();
  await expect(page.getByRole("heading", { name: "Crear cita" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear" })).toBeVisible();

  await page.getByRole("button", { name: "Crear" }).click();
  await expect(page.getByText("Cita creada correctamente")).toBeVisible();

  await expect(page.getByText("available")).toBeVisible();
  await expect(page.getByRole("button", { name: "available" })).toBeVisible();
  await expect(page.getByRole("button", { name: "available" })).toHaveCount(1);
  await page.getByRole("button", { name: "available" }).click();

  await expect(
    page.getByRole("heading", { name: "Actualizar cita" }),
  ).toBeVisible();
  await page.locator("button:has(svg.lucide-trash)").click();

  await expect(page.getByText("No se encontraron eventos")).toBeVisible();
});

test("Can create a booked appointment", async ({ page }) => {
  await page.goto("/appointments");

  await expect(page.getByRole("button", { name: "Nueva cita" })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByText("No se encontraron eventos")).toBeVisible();
  await page.getByRole("button", { name: "Nueva cita" }).click();
  await expect(page.getByRole("heading", { name: "Crear cita" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear" })).toBeVisible();
  await expect(page.getByLabel("Reservada")).toBeVisible();
  await page.getByLabel("Reservada").click();

  await expect(page.getByLabel("Número de cédula del paciente")).toBeVisible();
  await page.getByLabel("Número de cédula del paciente").fill("0954765780");
  await page.getByRole("button", { name: "Crear" }).click();

  await expect(page.getByText("Cita creada correctamente")).toBeVisible();
  await expect(page.getByText("booked")).toBeVisible();
  await expect(page.getByText("0954765780")).toBeVisible();

  await page.getByRole("button", { name: "booked" }).click();
  await expect(
    page.getByRole("heading", { name: "Actualizar cita" }),
  ).toBeVisible();
  await page.locator("button:has(svg.lucide-trash)").click();
  await expect(page.getByText("No se encontraron eventos")).toBeVisible();
});

test("Cannot create an appointment on the same time", async ({ page }) => {
  await page.goto("/appointments");

  await expect(page.getByRole("button", { name: "Nueva cita" })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByText("No se encontraron eventos")).toBeVisible();
  await page.getByRole("button", { name: "Nueva cita" }).click();
  await expect(page.getByRole("heading", { name: "Crear cita" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear" })).toBeVisible();

  await page.getByRole("button", { name: "Crear" }).click();
  await expect(page.getByText("Cita creada correctamente")).toBeVisible();

  await page.waitForTimeout(1500);
  await expect(page.getByRole("button", { name: "Nueva cita" })).toBeVisible();
  await page.getByRole("button", { name: "Nueva cita" }).click();
  await expect(page.getByRole("heading", { name: "Crear cita" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Crear" })).toBeVisible();

  await page.getByRole("button", { name: "Crear" }).click();

  await expect(
    page
      .getByText(
        "Ya existe una cita para este tiempo. Por favor, intenta con una diferente.",
      )
      .first(),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await expect(page.getByText("available")).toBeVisible();
  await expect(page.getByRole("button", { name: "available" })).toBeVisible();
  await expect(page.getByRole("button", { name: "available" })).toHaveCount(1);
  await page.getByRole("button", { name: "available" }).click();

  await expect(
    page.getByRole("heading", { name: "Actualizar cita" }),
  ).toBeVisible();
  await page.locator("button:has(svg.lucide-trash)").click();

  await expect(page.getByText("No se encontraron eventos")).toBeVisible();
});
