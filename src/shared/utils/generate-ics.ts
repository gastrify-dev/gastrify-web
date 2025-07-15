import { createEvent } from "ics";
import { getEmailMessage } from "@/shared/lib/react-email/email-i18n";

export interface ICSAppointmentData {
  appointmentId: string;
  startDate: Date;
  endDate: Date;
  title: string;
  description: string;
  location?: string;
  meetingLink?: string;
  language: "en" | "es";
}

export interface ICSFileResult {
  success: boolean;
  icsContent?: string;
  error?: string;
}

export function generateICSFile(data: ICSAppointmentData): ICSFileResult {
  try {
    // Format dates for ICS (YYYY-MM-DD format)
    const startDate = data.startDate;
    const endDate = data.endDate;

    // Create event data for ICS
    const event = {
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1, // Month is 0-indexed
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
      ] as [number, number, number, number, number],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes(),
      ] as [number, number, number, number, number],
      title: data.title,
      description: data.description,
      location: data.location || "",
      uid: `appointment-${data.appointmentId}@gastrify.com`,
    };

    // Generate ICS content
    const { error, value } = createEvent(event);

    if (error) {
      return {
        success: false,
        error: `Failed to create ICS event: ${error}`,
      };
    }

    return {
      success: true,
      icsContent: value,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error generating ICS file",
    };
  }
}

export function createAppointmentICSData(
  appointmentId: string,
  startDate: Date,
  durationMinutes: number,
  appointmentType: "in-person" | "virtual",
  location?: string,
  meetingLink?: string,
  language: "en" | "es" = "en",
): ICSAppointmentData {
  // Calculate end date
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  // Create title and description based on language and type
  const t = (key: string, vars?: Record<string, string>) =>
    getEmailMessage(
      `features.appointments.appointmentEmail.${key}`,
      language,
      vars,
    );

  const title = t("icsTitle");
  let description = "";
  if (appointmentType === "virtual" && meetingLink) {
    description = t("icsVirtualDescription", { appointmentId, meetingLink });
  } else {
    description = t("icsDescription", {
      appointmentId,
      type: appointmentType === "virtual" ? t("virtual") : t("in-person"),
      location: location || "",
    });
  }

  return {
    appointmentId,
    startDate,
    endDate,
    title,
    description,
    location: appointmentType === "in-person" ? location : undefined,
    meetingLink: appointmentType === "virtual" ? meetingLink : undefined,
    language,
  };
}

export function icsContentToBuffer(icsContent: string): Buffer {
  return Buffer.from(icsContent, "utf-8");
}

export function generateICSBuffer(data: ICSAppointmentData): Buffer | null {
  const result = generateICSFile(data);

  if (result.success && result.icsContent) {
    return icsContentToBuffer(result.icsContent);
  }

  return null;
}
