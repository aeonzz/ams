import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { JobRequestEvaluation } from "prisma/generated/zod";

type FieldPosition = {
  x: number;
  y: number;
  size?: number;
};

type FieldPositions = {
  [K in keyof JobRequestEvaluation]?: FieldPosition;
};

type CheckmarkPosition = {
  x: number;
  y: number;
  size: number;
};

export async function fillJobRequestEvaluationPDF(
  data: JobRequestEvaluation
): Promise<Blob> {
  const pdfPath = "/resources/job-request-evaluation.pdf";
  const pdfBytes = await fetch(pdfPath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  console.log(`PDF dimensions: ${width}x${height}`);

  const fieldPositions: FieldPositions = {
    position: { x: 120, y: height - 140, size: 10 },
    sex: { x: 320, y: height - 160, size: 10 },
    age: { x: 420, y: height - 160, size: 10 },
    regionOfResidence: { x: 180, y: height - 180, size: 10 },
    awarenessLevel: { x: 50, y: height - 280, size: 10 },
    visibility: { x: 50, y: height - 340, size: 10 },
    helpfulness: { x: 50, y: height - 380, size: 10 },
    suggestions: { x: 50, y: height - 700, size: 10 },
    createdAt: { x: 120, y: height - 160, size: 10 },
  };

  const clientTypeCheckmarks: { [key: string]: CheckmarkPosition } = {
    CITIZEN: { x: 64, y: height - 126, size: 8 },
    BUSINESS: { x: 98, y: height - 126, size: 8 },
    GOVERNMENT: { x: 133, y: height - 126, size: 8 },
  };

  if (data.clientType in clientTypeCheckmarks) {
    const checkmark = clientTypeCheckmarks[data.clientType];
    console.log(`Drawing checkmark at: ${checkmark.x}, ${checkmark.y}`);

    firstPage.drawText("X", {
      x: checkmark.x,
      y: checkmark.y,
      size: checkmark.size,
      font: font,
      color: rgb(0, 0, 0),
    });
  } else {
    console.log(
      `No matching checkmark position for client type: ${data.clientType}`
    );
  }

  Object.entries(fieldPositions).forEach(([key, position]) => {
    if (position && key in data) {
      const value = data[key as keyof JobRequestEvaluation];
      if (value !== null && value !== undefined) {
        let displayValue = String(value);
        if (key === "createdAt" || key === "updatedAt") {
          displayValue = new Date(value as string).toLocaleString();
        }
        firstPage.drawText(displayValue, {
          x: position.x,
          y: position.y,
          size: position.size || 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    }
  });

  // Handle surveyResponses
  if (data.surveyResponses) {
    const surveyResponsesY = height - 450;
    let yOffset = 0;
    Object.entries(data.surveyResponses).forEach(([key, value]) => {
      firstPage.drawText(`${key}: ${JSON.stringify(value)}`, {
        x: 50,
        y: surveyResponsesY - yOffset,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      yOffset += 20;
    });
  }

  const pdfBytes2 = await pdfDoc.save();
  return new Blob([pdfBytes2], { type: "application/pdf" });
}
