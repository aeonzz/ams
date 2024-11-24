import { Container, Html } from "@react-email/components";
import React from "react";

interface NotificationTemplateProps {
  name: string;
  link?: string;
  payload: string;
}

export default function NotificationTemplate({
  name,
  link,
  payload,
}: NotificationTemplateProps) {
  return (
    <Html>
      <Container className="bg-gray-400"></Container>
    </Html>
  );
}
