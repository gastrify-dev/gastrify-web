import { createEvent, type EventAttributes } from "ics";
/**
 * Descarga un archivo ICS en el navegador usando Blob y file-saver.
 * @param icsString El string ICS generado (por ejemplo, con la librería ics)
 * @param title Nombre del archivo (sin extensión)
 */
export function downloadIcsFile(icsString: string, title: string = "evento") {
  const blob = new Blob([icsString], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.ics`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

export interface IcsEventData {
  start: Date;
  end?: Date;
  summary: string;
  description?: string;
  location?: string;
  status?: "CONFIRMED" | "CANCELLED";
  uid?: string;
  method?: "REQUEST" | "CANCEL";
  sequence?: number;
}

/**
 * Genera un objeto de attachment ICS listo para Resend a partir de los datos de la cita.
 * @param event Datos del evento/cita
 * @returns Promise<{ filename: string; content: string; type: string; disposition: string }>
 */

export async function generateIcsAttachment(
  event: IcsEventData,
): Promise<{
  filename: string;
  content: string;
  type: string;
  disposition: string;
}> {
  return new Promise((resolve, reject) => {
    const start: [number, number, number, number, number] = [
      event.start.getFullYear(),
      event.start.getMonth() + 1,
      event.start.getDate(),
      event.start.getHours(),
      event.start.getMinutes(),
    ];
    let icsEvent: EventAttributes;
    if (event.end) {
      const end: [number, number, number, number, number] = [
        event.end.getFullYear(),
        event.end.getMonth() + 1,
        event.end.getDate(),
        event.end.getHours(),
        event.end.getMinutes(),
      ];
      icsEvent = {
        start,
        end,
        title: event.summary,
        description: event.description || "",
        location: event.location || "",
        status: event.status || "CONFIRMED",
        productId: "gastrify.aragundy.com",
        ...(event.uid && { uid: event.uid }),
        ...(typeof event.sequence === "number" && { sequence: event.sequence }),
      };
    } else {
      icsEvent = {
        start,
        duration: { minutes: 45 },
        title: event.summary,
        description: event.description || "",
        location: event.location || "",
        status: event.status || "CONFIRMED",
        productId: "gastrify.aragundy.com",
        ...(event.uid && { uid: event.uid }),
        ...(typeof event.sequence === "number" && { sequence: event.sequence }),
      };
    }
    createEvent(icsEvent, (error, value) => {
      if (error) {
        reject(error);
        return;
      }

      let icsString = value.replace(/METHOD:[A-Z]+\n?/g, "");
      if (event.method) {
        icsString = icsString.replace(
          "BEGIN:VCALENDAR",
          `BEGIN:VCALENDAR\nMETHOD:${event.method}`,
        );
      }
      const base64 = Buffer.from(icsString, "utf-8").toString("base64");
      resolve({
        filename: "cita.ics",
        content: base64,
        type: "text/calendar",
        disposition: "attachment",
      });
    });
  });
}
