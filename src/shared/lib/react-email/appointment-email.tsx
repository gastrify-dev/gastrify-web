import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentType: "in-person" | "virtual";
  appointmentLocation?: string;
  appointmentUrl?: string;
  action: "booked" | "canceled";
}

const AppointmentEmail = ({
  patientName,
  patientEmail,
  appointmentDate,
  appointmentType,
  appointmentLocation,
  appointmentUrl,
  action,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>
        {action === "booked" ? "Cita reservada" : "Cita cancelada"}
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-2xl border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="font-extrabold">Gastrify</Heading>
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {action === "booked" ? "Cita reservada" : "Cita cancelada"}
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              <b>Paciente:</b> {patientName} ({patientEmail})
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              <b>Fecha y hora:</b> {appointmentDate}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              <b>Tipo:</b>{" "}
              {appointmentType === "in-person" ? "Presencial" : "Virtual"}
            </Text>

            {action === "booked" &&
              appointmentType === "in-person" &&
              appointmentLocation && (
                <Text className="text-[14px] leading-[24px] text-black">
                  <b>Ubicación:</b> {appointmentLocation}
                </Text>
              )}

            {action === "booked" &&
              appointmentType === "virtual" &&
              appointmentUrl && (
                <Text className="text-[14px] leading-[24px] text-black">
                  <b>URL de la reunión:</b> {appointmentUrl}
                </Text>
              )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AppointmentEmail.PreviewProps = {
  patientName: "David Aragundy",
  patientEmail: "david@aragundy.com",
  appointmentDate: "2025-01-01 10:00",
  appointmentType: "in-person",
  appointmentLocation: "Calle 123, Ciudad, País",
  appointmentUrl: "https://meet.google.com/abc123",
  action: "booked",
} as Props;

export default AppointmentEmail;
