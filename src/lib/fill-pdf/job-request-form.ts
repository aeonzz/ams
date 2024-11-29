import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { format } from "date-fns";
import { formatFullName } from "../utils";
import type { RequestStatusTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestStatusTypeSchema";

type ImagePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
};

type Data = {
  id: string;
  idAlt: string;
  requestedBy: string;
  requestedByAlt: string;
  description: string;
  numberOfPerson: number;
  location: string;
  createdAt: string;
  reviewedBy: string | null;
  reviewedByAlt: string | null;
  departmentHead: string;
  startDate: Date | null;
  today: string;
  month: string;
  endDate: Date | null;
  personAttended: string;
  status: RequestStatusTypeType;
  images: string[];
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

async function embedImage(
  pdfDoc: PDFDocument,
  imageUrl: string
): Promise<[Uint8Array, string]> {
  const response = await fetch(imageUrl);
  const imageBytes = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "";

  return [new Uint8Array(imageBytes), contentType];
}

export async function fillJobRequestFormPDF(
  data: Data & { formUrl: string }
): Promise<Blob> {
  // const pdfPath = "/resources/FM-USTP-MEWS-01-JOB-REQUEST-FORM.pdf";
  const pdfBytes = await fetch(data.formUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(StandardFonts.CourierOblique);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const secondPage = pages[1];
  const { width, height } = firstPage.getSize();

  // console.log(`PDF dimensions: ${width}x${height}`);

  const fieldPositions: FieldPositions = {
    createdAt: { x: 407, y: height - 135, size: 10, maxWidth: 150 },
    id: { x: 423, y: height - 160, size: 10, maxWidth: 150 },
    description: { x: 105, y: height - 220, size: 10, maxWidth: 180 },
    location: { x: 287, y: height - 220, size: 10, maxWidth: 80 },
    numberOfPerson: { x: 400, y: height - 220, size: 10, maxWidth: 80 },
    requestedBy: { x: 50, y: height - 360, size: 10, maxWidth: 200 },
    reviewedBy: { x: 300, y: height - 360, size: 10, maxWidth: 200 },
    idAlt: { x: 315, y: height - 425, size: 10, maxWidth: 100 },
    requestedByAlt: { x: 55, y: height - 443, size: 10, maxWidth: 200 },
    endDate: { x: 330, y: height - 445, size: 10, maxWidth: 150 },
    today: { x: 130, y: height - 505, size: 10, maxWidth: 50 },
    month: { x: 215, y: height - 505, size: 10, maxWidth: 50 },
    departmentHead: { x: 80, y: height - 525, size: 10, maxWidth: 200 },
    reviewedByAlt: { x: 290, y: height - 605, size: 10, maxWidth: 200 },
    // startDate: { x: 456, y: height - 260, size: 10, maxWidth: 50 },
    // personAttended: { x: 570, y: height - 260, size: 10, maxWidth: 100 },
    // status: { x: 670, y: height - 260, size: 10, maxWidth: 100 },
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

  if (data.images && data.images.length > 0) {
    const imagePositions = [
      { x: 100, y: height - 400, width: 300, height: 300 },
      { x: 250, y: height - 750, width: 300, height: 300 },
    ];

    for (let i = 0; i < data.images.length; i++) {
      try {
        const [imageBytes, contentType] = await embedImage(
          pdfDoc,
          data.images[i]
        );
        const position = imagePositions[i];

        if (!position) {
          console.warn(`No position defined for image ${i + 1}`);
          continue;
        }

        let image;
        if (contentType.includes("jpeg") || contentType.includes("jpg")) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (contentType.includes("png")) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          console.warn(`Unsupported image type: ${contentType}`);
          continue;
        }

        secondPage.drawImage(image, {
          x: position.x,
          y: position.y,
          width: position.width,
          height: position.height,
        });
      } catch (error) {
        console.error(`Error embedding image ${i + 1}: ${error}`);
      }
    }
  }

  const pdfBytes2 = await pdfDoc.save();
  return new Blob([pdfBytes2], { type: "application/pdf" });
}
