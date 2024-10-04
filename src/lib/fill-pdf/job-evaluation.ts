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

export async function fillJobRequestEvaluationPDF(
  data: JobRequestEvaluation
): Promise<Blob> {
  const pdfPath = "/resources/job-request-evaluation.pdf";
  const pdfBytes = await fetch(pdfPath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(StandardFonts.CourierOblique);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height } = firstPage.getSize();

  const fieldPositions: FieldPositions = {
    clientType: { x: 50, y: 100 },
    id: { x: 50, y: 120 },
    position: { x: 50, y: 140 },
    sex: { x: 50, y: 160 },
    age: { x: 50, y: 180 },
    regionOfResidence: { x: 50, y: 200 },
    awarenessLevel: { x: 50, y: 220 },
    visibility: { x: 50, y: 240 },
    helpfulness: { x: 50, y: 260 },
    suggestions: { x: 50, y: 280 },
    jobRequestId: { x: 50, y: 300 },
    createdAt: { x: 50, y: 320 },
    updatedAt: { x: 50, y: 340 },
  };

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
          y: height - position.y,
          size: position.size || 12,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    }
  });

  // Handle surveyResponses separately
  if (data.surveyResponses) {
    let yPosition = 360;
    Object.entries(data.surveyResponses).forEach(([key, value]) => {
      firstPage.drawText(`${key}: ${JSON.stringify(value)}`, {
        x: 50,
        y: height - yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition += 20;
    });
  }

  const pdfBytes2 = await pdfDoc.save();
  return new Blob([pdfBytes2], { type: "application/pdf" });
}
