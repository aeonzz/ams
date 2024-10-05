import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { JobRequest } from "prisma/generated/zod";

type FieldPosition = {
  x: number;
  y: number;
  size?: number;
};

type FieldPositions = {
  [K in keyof JobRequest]?: FieldPosition;
};

type CheckmarkPosition = {
  x: number;
  y: number;
  size: number;
};

export async function fillJobRequestFormPDF(data: JobRequest): Promise<Blob> {
  const pdfPath = "/resources/job-request-evaluation.pdf";
  const pdfBytes = await fetch(pdfPath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  console.log(`PDF dimensions: ${width}x${height}`);

  const pdfBytes2 = await pdfDoc.save();
  return new Blob([pdfBytes2], { type: "application/pdf" });
}
