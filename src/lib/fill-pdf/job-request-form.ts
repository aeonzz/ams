import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { format } from "date-fns";
import { formatFullName } from "../utils";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

type Data = {
  id: string;
  requestedBy: string;
  description: string;
  location: string;
  createdAt: Date;
  startDate: Date | null;
  endDate: Date | null;
  personAttended: string;
  status: RequestStatusTypeType;
};

type FieldPosition = {
  x: number;
  y: number;
  size?: number;
  maxWidth?: number;
};

type FieldPositions = {
  [K in keyof Data]?: FieldPosition;
};

function sanitizeText(text: string): string {
  // Replace newlines and other problematic characters
  return text.replace(/[\n\r\t\f\v]/g, " ");
}

function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const sanitizedText = sanitizeText(text);
  const words = sanitizedText.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    let width: number;
    try {
      width = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
    } catch (error) {
      console.warn(`Error measuring text width: ${error}`);
      width = 0; // Fallback to prevent infinite loop
    }
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export async function fillJobRequestFormPDF(
  data: Data & { formUrl: string }
): Promise<Blob> {
  // const pdfPath = "/resources/FM-USTP-MEWS-01-JOB-REQUEST-FORM.pdf";
  const pdfBytes = await fetch(data.formUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  console.log(`PDF dimensions: ${width}x${height}`);

  const fieldPositions: FieldPositions = {
    id: { x: 70, y: height - 260, size: 10, maxWidth: 200 },
    description: { x: 143, y: height - 280, size: 6, maxWidth: 200 },
    location: { x: 350, y: height - 260, size: 10, maxWidth: 100 },
    createdAt: { x: 600, y: height - 187, size: 10, maxWidth: 150 },
    startDate: { x: 456, y: height - 260, size: 10, maxWidth: 50 },
    endDate: { x: 510, y: height - 260, size: 10, maxWidth: 50 },
    personAttended: { x: 570, y: height - 260, size: 10, maxWidth: 100 },
    status: { x: 670, y: height - 260, size: 10, maxWidth: 100 },
    requestedBy: { x: 150, y: height - 450, size: 10, maxWidth: 150 },
  };

  // function drawDebugRectangle(
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // ) {
  //   firstPage.drawRectangle({
  //     x,
  //     y,
  //     width,
  //     height,
  //     borderColor: rgb(1, 0, 0),
  //     borderWidth: 1,
  //   });
  // }

  Object.entries(fieldPositions).forEach(([key, position]) => {
    if (position && key in data) {
      const value = data[key as keyof Data];
      if (value !== null && value !== undefined) {
        let displayValue = String(value);
        if (
          key === "createdAt" ||
          key === "updatedAt" ||
          key === "startDate" ||
          key === "endDate"
        ) {
          displayValue = format(new Date(value as Date), "PPp");
        }
        const fontSize = position.size || 12;
        const maxWidth = position.maxWidth || 300;
        const lines = wrapText(displayValue, maxWidth, font, fontSize);

        // const rectHeight = lines.length * (fontSize + 2);
        // drawDebugRectangle(position.x, position.y, maxWidth, -rectHeight);

        lines.forEach((line, index) => {
          try {
            firstPage.drawText(line, {
              x: position.x,
              y: position.y - index * (fontSize + 2),
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
          } catch (error) {
            console.error(`Error drawing text for ${key}: ${error}`);
          }
        });
      }
    }
  });

  const pdfBytes2 = await pdfDoc.save();
  return new Blob([pdfBytes2], { type: "application/pdf" });
}
