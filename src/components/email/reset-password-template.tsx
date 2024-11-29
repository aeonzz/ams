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
import { env } from "@/lib/env.mjs";

interface ResetPasswordTemplateProps {
  email: string;
  resetPasswordToken: string;
}

export const ResetPasswordTemplate = ({
  email,
  resetPasswordToken,
}: ResetPasswordTemplateProps) => (
  <Html>
    <Head />
    <Preview>Reset Your Sync Account Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://your-company-logo-url.com/logo.png"
          alt="Sync Logo"
          width="100"
          height="50"
          style={logo}
        />
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>
          Hello {email},
        </Text>
        <Text style={text}>
          We received a request to reset the password for AMS your account. If you didn&apos;t make this request, you can safely ignore this email.
        </Text>
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${env.NEXT_PUBLIC_APP_URL}/sign-in/reset-password?token=${resetPasswordToken}`}
          >
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          This password reset link will expire in 24 hours. If you need to reset your password after that, please request a new reset link.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you&apos;re having trouble clicking the &quot;Reset Password&quot; button, copy and paste the following URL into your web browser:
        </Text>
        <Link
          href={`${env.NEXT_PUBLIC_APP_URL}/sign-in/reset-password?token=${resetPasswordToken}`}
          style={link}
        >
          {`${env.NEXT_PUBLIC_APP_URL}/sign-in/reset-password?token=${resetPasswordToken}`}
        </Link>
        <Text style={footer}>
          If you didn&apos;t request a password reset, please ignore this email or <Link href="mailto:support@sync.com" style={link}>contact support</Link> if you have questions.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
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

const link = {
  color: "#007ee6",
  textDecoration: "underline",
};

