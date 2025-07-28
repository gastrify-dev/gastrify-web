import { createEvent, type EventAttributes, type DateTime } from "ics";

export interface IcsEventData {
  id: string;
  start: Date;
  end: Date;
  title: string;
  description: string;
  location?: string;
  meetingUrl?: string;
}

export async function generateIcsAttachment(event: IcsEventData): Promise<{
  filename: string;
  content: string;
  type: string;
  disposition: string;
}> {
  return new Promise((resolve, reject) => {
    const start: DateTime = [
      event.start.getFullYear(),
      event.start.getMonth() + 1,
      event.start.getDate(),
      event.start.getHours(),
      event.start.getMinutes(),
    ];

    const end: DateTime = [
      event.end.getFullYear(),
      event.end.getMonth() + 1,
      event.end.getDate(),
      event.end.getHours(),
      event.end.getMinutes(),
    ];

    const icsEvent: EventAttributes = {
      start,
      end,
      title: event.title,
      description: event.description,
      location: event.location,
      url: event.meetingUrl,
      status: "CONFIRMED",
      busyStatus: "BUSY",
      productId: "gastrify.aragundy.com",
      uid: event.id,
      organizer: {
        name: "Gastrify",
        email: "mail@gastrify.aragundy.com",
      },
    };

    createEvent(icsEvent, (error, value) => {
      if (error) return reject(error);

      const base64 = Buffer.from(value).toString("base64");

      resolve({
        filename: "cita.ics",
        content: base64,
        type: "text/calendar",
        disposition: "attachment",
      });
    });
  });
}
