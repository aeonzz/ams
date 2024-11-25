import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { format } from "date-fns";
import { formatFullName } from "../utils";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

type Data = {
  createdAt: Date;
  requestedBy: string;
  requestedByCopy: string;
  office: string;
  destination: string;
  numberOfPassengers: number;
  passengersName: string[];
  vehicle: string;
  dateOfTravel: Date;
  description: string;
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

export async function fillTransportRequestFormPDF(
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
  console.log(data.numberOfPassengers);

  const fieldPositions: FieldPositions = {
    createdAt: { x: 100, y: height - 125, size: 9, maxWidth: 200 },
    requestedBy: { x: 155, y: height - 138, size: 9, maxWidth: 200 },
    office: { x: 375, y: height - 138, size: 9, maxWidth: 100 },
    destination: { x: 130, y: height - 150, size: 9, maxWidth: 150 },
    numberOfPassengers: { x: 410, y: height - 150, size: 9, maxWidth: 50 },
    passengersName: { x: 160, y: height - 165, size: 8, maxWidth: 420 },
    vehicle: { x: 110, y: height - 178, size: 9, maxWidth: 200 },
    dateOfTravel: { x: 140, y: height - 190, size: 9, maxWidth: 200 },
    description: { x: 70, y: height - 215, size: 9, maxWidth: 420 },
    status: { x: 120, y: height - 245, size: 9, maxWidth: 150 },
    requestedByCopy: { x: 70, y: height - 310, size: 9, maxWidth: 150 },
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
          key === "dateOfTravel"
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
