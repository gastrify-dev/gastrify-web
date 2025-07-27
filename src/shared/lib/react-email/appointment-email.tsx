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
  appointmentType: string;
  action: "booked" | "canceled";
}

const AppointmentEmail = ({
  patientName,
  patientEmail,
  appointmentDate,
  appointmentType,
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
              <b>Tipo:</b> {appointmentType}
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              {action === "booked"
                ? "La cita ha sido reservada exitosamente."
                : "La cita ha sido cancelada."}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppointmentEmail;
