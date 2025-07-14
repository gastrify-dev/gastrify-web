import { createNotification } from "@/features/notifications/actions/create-notification";

async function main() {
  const notification = await createNotification({
    userId: "GS1fnkgLCtH1E2cDsXGTDeeSWcQXHNpd",
    titleEs: "Cita médica de prueba",
    previewEs: "Tienes una cita médica mañana.",
    contentEs: "Recuerda tu cita médica programada para mañana a las 10:00 AM.",
  });
  const notification2 = await createNotification({
    userId: "GS1fnkgLCtH1E2cDsXGTDeeSWcQXHNpd",
    titleEs: "Cita médica de prueba 2",
    previewEs: "Tienes una cita médica dentro de 5 días.",
    contentEs:
      "Recuerda tu cita médica programada para el sábado 19 de Julio a las 10:00 AM.",
  });
  console.log("Notificación creada en español:", notification, notification2);
}

main().catch(console.error);
