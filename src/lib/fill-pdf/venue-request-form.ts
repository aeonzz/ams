import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { format } from "date-fns";
import { formatFullName } from "../utils";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

type Data = {
  requestedBy: string;
  requestedByAlt?: string;
  createdAt: Date;
  venue: string;
  dateReserved: Date;
  actualStart: string | null;
  purpose: string;
  equipmentNeeded: string;
  department: string;
  status: RequestStatusTypeType;
  departmentHead: string;
  notedBy: string;
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

export async function fillVenueRequestFormPDF(
  data: Data & { formUrl: string }
): Promise<Blob> {
  // const pdfPath = "/resources/FM-USTP-MEWS-01-JOB-REQUEST-FORM.pdf";
  const pdfBytes = await fetch(data.formUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(StandardFonts.CourierOblique);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  console.log(`PDF dimensions: ${width}x${height}`);

  const fieldPositions: FieldPositions = {
    requestedBy: { x: 110, y: height - 175, size: 10, maxWidth: 200 },
    createdAt: { x: 85, y: height - 223, size: 10, maxWidth: 200 },
    department: { x: 115, y: height - 248, size: 10, maxWidth: 200 },
    venue: { x: 87, y: height - 270, size: 10, maxWidth: 100 },
    dateReserved: { x: 130, y: height - 293, size: 10, maxWidth: 150 },
    actualStart: { x: 132, y: height - 315, size: 10, maxWidth: 150 },
    purpose: { x: 50, y: height - 359, size: 10, maxWidth: 200 },
    equipmentNeeded: { x: 300, y: height - 360, size: 10, maxWidth: 200 },
    status: { x: 100, y: height - 455, size: 10, maxWidth: 100 },
    requestedByAlt: { x: 50, y: height - 513, size: 10, maxWidth: 150 },
    departmentHead: { x: 230, y: height - 578, size: 10, maxWidth: 150 },
    notedBy: { x: 305, y: height - 513, size: 10, maxWidth: 150 },
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
          key === "dateReserved"
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
