"use server";

import nodemailer from "nodemailer";
import { env } from "../env.mjs";
import { authedProcedure, getErrorMessage } from "./utils";
import { z } from "zod";
import { db } from "@/lib/db";
import { render } from "@react-email/components";
import NotificationTemplate from "@/components/email/notification-template";
import { formatFullName } from "../utils";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT || "587"),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmailNotification = authedProcedure
  .createServerAction()
  .input(
    z.object({
      recipientIds: z.array(z.string()).min(1, {
        message: "At least one recipient ID is required",
      }),
      resourceId: z.string().optional(),
      payload: z.string().min(1),
      title: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const { recipientIds, resourceId, payload, title } = input;
    try {
      const users = await db.user.findMany({
        where: {
          id: {
            in: recipientIds,
          },
        },
      });

      if (users.length === 0) {
        throw "No users found";
      }

      const emailPromises = users.map(async (user) => {
        const emailHtml = render(
          NotificationTemplate({
            name: formatFullName(
              user.firstName,
              user.middleName,
              user.lastName
            ),
            link: `${env.NEXT_PUBLIC_APP_URL}/${resourceId}`,
            payload: payload,
            preview: title,
          })
        );

        return transporter.sendMail({
          from: env.SMTP_FROM,
          to: user.email,
          subject: "You have new notification",
          html: emailHtml,
        });
      });

      const results = await Promise.all(emailPromises);

      return {
        success: true,
        results: results,
        sentTo: users.length,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  });
