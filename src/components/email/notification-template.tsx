import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NotificationTemplateProps {
  name: string;
  link?: string;
  payload: string;
  preview: string;
}

export const NotificationTemplate = ({
  name,
  link,
  payload,
  preview
}: NotificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://utfs.io/f/kl4weUdrwUH2r4J2xtULCnNBXLfT5yh8jsRlV3HuvGEKSQaM"
          alt="Logo"
          width="100"
          height="100"
          style={logo}
        />
        <Heading style={h1}>{preview}</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          You have received a new notification. Here are the details:
        </Text>
        <Text style={text}>{payload}</Text>
        {link && (
          <Section style={buttonContainer}>
            <Button style={button} href={link}>
              View Details
            </Button>
          </Section>
        )}
        <Hr style={hr} />
        <Text style={footer}>
          If you're having trouble viewing this notification, please contact our
          support team.
        </Text>
        {link && (
          <Text style={footer}>
            Or copy and paste this URL into your browser:{" "}
            <Link href={link} style={linkStyle}>
              {link}
            </Link>
          </Text>
        )}
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "60px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
  padding: "45px",
  margin: "0 auto",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
  backgroundSize: "cover",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "24px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "36px 0",
};

const button = {
  backgroundColor: "#1b1952",
  borderRadius: "4px",
  color: "#fbb318",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  width: "auto",
  padding: "14px 28px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#6c757d",
  fontSize: "12px",
  lineHeight: "20px",
  marginBottom: "12px",
};

const linkStyle = {
  color: "#007ee6",
  textDecoration: "underline",
};

export default NotificationTemplate;
