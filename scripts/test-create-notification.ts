import { createNotification } from "@/features/notifications/actions/create-notification";

async function main() {
  const notification = await createNotification({
    userId: "GS1fnkgLCtH1E2cDsXGTDeeSWcQXHNpd",
    title: "Cita médica de prueba 3",
    preview: "Tienes una cita médica mañana.",
    content: "Recuerda tu cita médica programada para mañana a las 14:00 PM.",
  });
  console.log("Notificación creada:", notification);
}

main().catch(console.error);
