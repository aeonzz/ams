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

export const sendNotification = authedProcedure
  .createServerAction()
  .input(
    z.object({
      recepientId: z.string({
        required_error: "Recepient ID is required",
      }),
      resourceId: z.string().optional(),
      payload: z.string().min(1),
    })
  )
  .handler(async ({ input }) => {
    const { recepientId, resourceId, payload } = input;
    try {
      const user = await db.user.findUnique({
        where: {
          id: recepientId,
        },
      });

      if (!user) {
        throw "User not found";
      }

      const emailHtml = render(
        NotificationTemplate({
          name: formatFullName(user.firstName, user.middleName, user.lastName),
          link: resourceId,
          payload: payload,
        })
      );

      const data = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: "Welcome to Our Platform!",
        html: emailHtml,
      });

      return data;
    } catch (error) {
      console.log(error);
      getErrorMessage(error);
    }
  });
