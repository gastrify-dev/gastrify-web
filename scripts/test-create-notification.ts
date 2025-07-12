import { createNotification } from "@/features/notifications/actions/create-notification";

async function main() {
  const notification = await createNotification({
    userId: "GS1fnkgLCtH1E2cDsXGTDeeSWcQXHNpd",
    titleEs: "Cita médica de prueba",
    previewEs: "Tienes una cita médica mañana.",
    contentEs: "Recuerda tu cita médica programada para mañana a las 10:00 AM.",
  });
  console.log("Notificación creada en español:", notification);
}

main().catch(console.error);
