import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { getEmailMessage } from "./email-i18n";
import * as React from "react";

interface AppointmentConfirmationEmailProps {
  patientName: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "in-person" | "virtual";
  location?: string;
  meetingLink?: string;
  durationMinutes: number;
  language: "en" | "es";
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gastrify.com";

export const AppointmentConfirmationEmail: React.FC<
  AppointmentConfirmationEmailProps
> = ({
  patientName,
  appointmentId,
  appointmentDate,
  appointmentTime,
  appointmentType,
  location,
  meetingLink,
  durationMinutes,
  language,
}) => {
  const t = (key: string, vars?: Record<string, string>) =>
    getEmailMessage(
      `features.appointments.appointment-confirmation.${key}`,
      language,
      vars,
    );

  return (
    <Html lang={language}>
      <Head>
        <title>{t("subject")}</title>
      </Head>
      <Preview>{t("confirmation")}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="120"
              height="40"
              alt="Gastrify"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Text style={greeting}>{t("greeting", { name: patientName })}</Text>
            <Text style={confirmation}>{t("confirmation")}</Text>

            <Section style={detailsCard}>
              <Text style={sectionTitle}>{t("appointmentDetails")}</Text>

              <Section style={detailRow}>
                <Text style={detailLabel}>{t("date")}:</Text>
                <Text style={detailValue}>{appointmentDate}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>{t("time")}:</Text>
                <Text style={detailValue}>{appointmentTime}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>{t("duration")}:</Text>
                <Text style={detailValue}>{durationMinutes} minutes</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>{t("type")}:</Text>
                <Text style={detailValue}>
                  {appointmentType === "virtual"
                    ? t("virtual")
                    : t("in-person")}
                </Text>
              </Section>

              {appointmentType === "in-person" && location && (
                <Section style={detailRow}>
                  <Text style={detailLabel}>{t("location")}:</Text>
                  <Text style={detailValue}>{location}</Text>
                </Section>
              )}

              {appointmentType === "virtual" && meetingLink && (
                <Section style={detailRow}>
                  <Text style={detailLabel}>{t("meetingLink")}:</Text>
                  <Link href={meetingLink} style={meetingLinkStyle}>
                    {meetingLink}
                  </Link>
                </Section>
              )}

              <Section style={detailRow}>
                <Text style={detailLabel}>{t("appointmentId")}:</Text>
                <Text style={detailValue}>{appointmentId}</Text>
              </Section>
            </Section>

            <Section style={calendarSection}>
              <Text style={sectionTitle}>{t("calendarInfo")}</Text>
              <Text style={calendarDescription}>
                {t("calendarDescription")}
              </Text>

              <Text style={calendarInstructions}>
                {t("calendarInstructions")}
              </Text>
              <Text style={calendarStep}>{t("calendarStep1")}</Text>
              <Text style={calendarStep}>{t("calendarStep2")}</Text>
              <Text style={calendarStep}>{t("calendarStep3")}</Text>
            </Section>

            <Section style={contactSection}>
              <Text style={sectionTitle}>{t("contactInfo")}</Text>
              <Text style={contactDescription}>{t("contactDescription")}</Text>
              <Text style={contactDetail}>{t("contactEmail")}</Text>
              <Text style={contactDetail}>{t("contactPhone")}</Text>
            </Section>

            <Section style={reminderSection}>
              <Text style={reminderText}>
                {appointmentType === "virtual"
                  ? t("virtualReminder")
                  : t("reminder")}
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>{t("footer")}</Text>
            <Text style={companyInfo}>{t("companyInfo")}</Text>
            <Text style={address}>{t("address")}</Text>
            <Text style={address}>{t("city")}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const header = {
  padding: "25px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "0 24px",
};

const greeting = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: "16px",
};

const confirmation = {
  fontSize: "16px",
  color: "#6b7280",
  marginBottom: "32px",
};

const detailsCard = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "32px",
  border: "1px solid #e5e7eb",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: "16px",
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const detailLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  flex: "0 0 30%",
};

const detailValue = {
  fontSize: "14px",
  color: "#1f2937",
  flex: "0 0 70%",
};

const meetingLinkStyle = {
  color: "#2563eb",
  textDecoration: "underline",
};

const calendarSection = {
  marginBottom: "32px",
};

const calendarDescription = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "16px",
  lineHeight: "1.5",
};

const calendarInstructions = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "8px",
};

const calendarStep = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "4px",
  paddingLeft: "16px",
};

const contactSection = {
  marginBottom: "32px",
};

const contactDescription = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "12px",
  lineHeight: "1.5",
};

const contactDetail = {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "4px",
};

const reminderSection = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "32px",
  border: "1px solid #f59e0b",
};

const reminderText = {
  fontSize: "14px",
  color: "#92400e",
  fontWeight: "600",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  padding: "0 24px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "16px",
};

const companyInfo = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  marginBottom: "4px",
};

const address = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "2px",
};

export default AppointmentConfirmationEmail;
