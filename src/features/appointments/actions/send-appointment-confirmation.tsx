"use server";

import * as React from "react";
import { render } from "@react-email/components";
import { getTranslations } from "next-intl/server";

import { resend } from "@/shared/lib/resend/server";
import { AppointmentConfirmationEmail } from "@/shared/lib/react-email/appointment-confirmation";
import {
  createAppointmentICSData,
  generateICSBuffer,
} from "@/shared/utils/generate-ics";
import { tryCatch } from "@/shared/utils/try-catch";
import type { ActionResponse } from "@/shared/types";

export interface SendAppointmentConfirmationParams {
  to: string;
  patientName: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "in-person" | "virtual";
  location?: string;
  meetingLink?: string;
  language: "en" | "es";
  startDate?: Date;
  durationMinutes?: number;
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

function generateICS({
  appointmentId,
  startDate,
  durationMinutes,
  appointmentType,
  location,
  meetingLink,
  language,
}: {
  appointmentId: string;
  startDate: Date;
  durationMinutes: number;
  appointmentType: "in-person" | "virtual";
  location?: string;
  meetingLink?: string;
  language: "en" | "es";
}): EmailData["attachments"] | undefined {
  return (async () => {
    const { data: icsBuffer, error } = await tryCatch(
      Promise.resolve(
        generateICSBuffer(
          createAppointmentICSData(
            appointmentId,
            startDate,
            durationMinutes,
            appointmentType,
            location,
            meetingLink,
            language,
          ),
        ),
      ),
    );
    if (error) {
      console.error("Failed to generate ICS file:", error);
      return undefined;
    }
    if (icsBuffer) {
      console.log("ICS file generated and attached successfully");
      return [
        {
          filename: `appointment-${appointmentId}.ics`,
          content: icsBuffer,
          contentType: "text/calendar",
        },
      ];
    }
    return undefined;
  })() as unknown as EmailData["attachments"] | undefined;
}

export type SendAppointmentConfirmationErrorCode =
  | "RENDER_ERROR"
  | "MISSING_DATA"
  | "ICS_ERROR"
  | "SEND_ERROR";

export async function sendAppointmentConfirmation({
  to,
  patientName,
  appointmentId,
  appointmentDate,
  appointmentTime,
  appointmentType,
  location,
  meetingLink,
  language,
  startDate,
  durationMinutes,
}: SendAppointmentConfirmationParams): Promise<
  ActionResponse<{ messageId: string }, SendAppointmentConfirmationErrorCode>
> {
  const { data: emailHtml, error: renderError } = await tryCatch(
    render(
      <AppointmentConfirmationEmail
        patientName={patientName}
        appointmentId={appointmentId}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
        appointmentType={appointmentType}
        location={location}
        durationMinutes={durationMinutes ?? 0}
        meetingLink={meetingLink}
        language={language}
      />,
    ),
  );
  if (renderError) {
    console.error("Failed to render appointment confirmation email:", {
      appointmentId,
      to,
      error: renderError.message,
    });
    return {
      data: null,
      error: {
        code: "RENDER_ERROR",
        message: renderError.message,
      },
    };
  }

  const t = await getTranslations(
    "features.appointments.appointment-confirmation",
  );
  const subject = t("subject");

  const emailData: EmailData = {
    from: "Gastrify <mail@gastrify.aragundy.com>",
    to: [to],
    subject: subject,
    html: emailHtml,
  };

  if (!startDate || !durationMinutes) {
    return {
      data: null,
      error: {
        code: "MISSING_DATA",
        message:
          "Missing required data to attach the calendar file (.ics): startDate or durationMinutes",
      },
    };
  }
  const { data: attachments, error: icsError } = await tryCatch(
    Promise.resolve(
      generateICS({
        appointmentId,
        startDate,
        durationMinutes,
        appointmentType,
        location,
        meetingLink,
        language,
      }),
    ),
  );
  if (icsError) {
    console.error("Failed to generate ICS file:", {
      appointmentId,
      to,
      error: icsError.message,
    });
    return {
      data: null,
      error: {
        code: "ICS_ERROR",
        message: icsError.message,
      },
    };
  }
  if (attachments) {
    emailData.attachments = attachments;
  }

  const { data: result, error: sendError } = await tryCatch(
    resend.emails.send(emailData),
  );
  if (sendError) {
    console.error("Failed to send appointment confirmation email:", {
      appointmentId,
      to,
      error: sendError.message,
    });
    return {
      data: null,
      error: {
        code: "SEND_ERROR",
        message: sendError.message,
      },
    };
  }

  console.log("Appointment confirmation email sent successfully:", {
    appointmentId,
    to,
    messageId: result?.data?.id,
  });

  if (!result?.data?.id) {
    return {
      data: null,
      error: {
        code: "SEND_ERROR",
        message: "No se recibió un messageId válido tras enviar el correo.",
      },
    };
  }

  return {
    data: { messageId: result.data.id },
    error: null,
  };
}
