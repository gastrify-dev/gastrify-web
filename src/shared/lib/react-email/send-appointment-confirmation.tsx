import * as React from "react";
import { render } from "@react-email/components";
import { resend } from "../resend/server";
import { AppointmentConfirmationEmail } from "./appointment-confirmation";
import {
  createAppointmentICSData,
  generateICSBuffer,
} from "../../utils/generate-ics";

interface SendAppointmentConfirmationParams {
  to: string;
  patientName: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "in-person" | "virtual";
  location?: string;
  meetingLink?: string;
  duration: string;
  language: "en" | "es";
  calendarAttachment?: boolean;
  startDate?: Date; // For ICS generation
  durationMinutes?: number; // For ICS generation
}

interface EmailData {
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendAppointmentConfirmation({
  to,
  patientName,
  appointmentId,
  appointmentDate,
  appointmentTime,
  appointmentType,
  location,
  meetingLink,
  duration,
  language,
  calendarAttachment = true,
  startDate,
  durationMinutes,
}: SendAppointmentConfirmationParams) {
  try {
    // Render the email template
    const emailHtml = await render(
      <AppointmentConfirmationEmail
        patientName={patientName}
        appointmentId={appointmentId}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
        appointmentType={appointmentType}
        location={location}
        meetingLink={meetingLink}
        duration={duration}
        language={language}
        calendarAttachment={calendarAttachment}
      />,
    );

    // Get subject line based on language
    const subject =
      language === "es"
        ? "Confirmación de Cita - Gastrify"
        : "Appointment Confirmation - Gastrify";

    // Prepare email data
    const emailData: EmailData = {
      from: "Gastrify <mail@gastrify.aragundy.com>",
      to: [to],
      subject: subject,
      html: emailHtml,
    };

    // Generate and add ICS file attachment if calendar attachment is enabled and we have the required data
    if (calendarAttachment && startDate && durationMinutes) {
      try {
        const icsData = createAppointmentICSData(
          appointmentId,
          startDate,
          durationMinutes,
          appointmentType,
          location,
          meetingLink,
          language,
        );

        const icsBuffer = generateICSBuffer(icsData);

        if (icsBuffer) {
          emailData.attachments = [
            {
              filename: `appointment-${appointmentId}.ics`,
              content: icsBuffer,
              contentType: "text/calendar",
            },
          ];
          console.log("ICS file generated and attached successfully");
        }
      } catch (error) {
        console.error("Failed to generate ICS file:", error);
        // Continue without ICS attachment
      }
    }

    // Send email
    const result = await resend.emails.send(emailData);

    // Log success
    console.log("Appointment confirmation email sent successfully:", {
      appointmentId,
      to,
      messageId: result.data?.id,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    // Log error but don't throw to avoid blocking appointment booking
    console.error("Failed to send appointment confirmation email:", {
      appointmentId,
      to,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to format date and time for email
export function formatAppointmentDateTime(
  date: Date,
  language: "en" | "es",
): {
  date: string;
  time: string;
} {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const locale = language === "es" ? "es-ES" : "en-US";

  return {
    date: date.toLocaleDateString(locale, dateOptions),
    time: date.toLocaleTimeString(locale, timeOptions),
  };
}
