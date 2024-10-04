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

  const font = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  console.log(`PDF dimensions: ${width}x${height}`);

  const fieldPositions: FieldPositions = {
    age: { x: 285, y: height - 143, size: 6 },
    regionOfResidence: { x: 86, y: height - 151, size: 6 },
    suggestions: { x: 30, y: height - 550, size: 6 },
    createdAt: { x: 47, y: height - 143, size: 6 },
  };

  const clientTypeCheckmarks: { [key: string]: CheckmarkPosition } = {
    CITIZEN: { x: 64, y: height - 126, size: 8 },
    BUSINESS: { x: 98, y: height - 126, size: 8 },
    GOVERNMENT: { x: 133, y: height - 126, size: 8 },
  };

  const positionCheckmarks: { [key: string]: CheckmarkPosition } = {
    Faculty: { x: 53, y: height - 134, size: 8 },
    "Non-Teaching Staff": { x: 88, y: height - 134, size: 8 },
    Student: { x: 157, y: height - 134, size: 8 },
    "Guardian/Parent of Student": { x: 192, y: height - 134, size: 8 },
    Alumna: { x: 283, y: height - 134, size: 8 },
  };

  const sexCheckmarks: { [key: string]: CheckmarkPosition } = {
    Male: { x: 169, y: height - 143.6, size: 8 },
    Female: { x: 199, y: height - 143.6, size: 8 },
  };

  const awarenessLevelCheckmarks: { [key: string]: CheckmarkPosition } = {
    aware_and_saw: { x: 58, y: height - 195, size: 8 },
    aware_but_not_saw: { x: 58, y: height - 203, size: 8 },
    learned_when_saw: { x: 58, y: height - 213, size: 8 },
    not_aware: { x: 58, y: height - 222, size: 8 },
  };

  const visibilityCheckmarks: { [key: string]: CheckmarkPosition } = {
    easy: { x: 58, y: height - 246, size: 8 },
    somewhat_easy: { x: 58, y: height - 255, size: 8 },
    difficult: { x: 58, y: height - 264, size: 8 },
    not_visible: { x: 255, y: height - 246, size: 8 },
    "N/A": { x: 255, y: height - 256, size: 8 },
  };

  const helpfulnessCheckmarks: { [key: string]: CheckmarkPosition } = {
    very_helpful: { x: 58, y: height - 289, size: 8 },
    somewhat_helpful: { x: 58, y: height - 298, size: 8 },
    not_helpful: { x: 255, y: height - 289, size: 8 },
    "N/A": { x: 255, y: height - 299, size: 8 },
  };

  const surveyResponsesCheckmarks: { [key: string]: CheckmarkPosition } = {
    Strongly_Disagree: { x: 225, y: height - 380, size: 8 },
    Disagree: { x: 263, y: height - 394, size: 8 },
    Neither_Agree_Nor_Disagree: { x: 301, y: height - 410, size: 8 },
    Agree: { x: 340, y: height - 430, size: 8 },
    Strongly_Agree: { x: 379, y: height - 446, size: 8 },
    Not_Applicable: { x: 417, y: height - 465, size: 8 },
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

  if (data.position in positionCheckmarks) {
    const checkmark = positionCheckmarks[data.position];
    console.log(
      `Drawing position checkmark at: ${checkmark.x}, ${checkmark.y}`
    );

    firstPage.drawText("X", {
      x: checkmark.x,
      y: checkmark.y,
      size: checkmark.size,
      font: font,
      color: rgb(0, 0, 0),
    });
  } else {
    console.log(`Writing position in "Others" field: ${data.position}`);
    firstPage.drawText(data.position, {
      x: 390,
      y: height - 134,
      size: 8,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  if (data.sex in sexCheckmarks) {
    const checkmark = sexCheckmarks[data.sex];
    console.log(`Drawing sex checkmark at: ${checkmark.x}, ${checkmark.y}`);

    firstPage.drawText("X", {
      x: checkmark.x,
      y: checkmark.y,
      size: checkmark.size,
      font: font,
      color: rgb(0, 0, 0),
    });
  } else {
    console.log(`Invalid sex value: ${data.sex}`);
  }

  firstPage.drawText("Job", {
    x: 210,
    y: height - 151,
    size: 6,
    font: font,
    color: rgb(0, 0, 0),
  });

  if (data.awarenessLevel in awarenessLevelCheckmarks) {
    const checkmark = awarenessLevelCheckmarks[data.awarenessLevel];
    console.log(`Drawing checkmark at: ${checkmark.x}, ${checkmark.y}`);

    firstPage.drawText("X", {
      x: checkmark.x,
      y: checkmark.y,
      size: checkmark.size,
      font: font,
      color: rgb(0, 0, 0),
    });
  } else {
    console.log(`Invalid value: ${data.sex}`);
  }

  if (data.visibility in visibilityCheckmarks) {
    const checkmark = visibilityCheckmarks[data.visibility];
    console.log(`Drawing checkmark at: ${checkmark.x}, ${checkmark.y}`);

    firstPage.drawText("X", {
      x: checkmark.x,
      y: checkmark.y,
      size: checkmark.size,
      font: font,
      color: rgb(0, 0, 0),
    });
  } else {
    console.log(`Invalid value: ${data.visibility}`);
  }

  if (data.helpfulness in helpfulnessCheckmarks) {
    const checkmark = helpfulnessCheckmarks[data.helpfulness];
    console.log(`Drawing checkmark at: ${checkmark.x}, ${checkmark.y}`);

    firstPage.drawText("X", {
      x: checkmark.x,
      y: checkmark.y,
      size: checkmark.size,
      font: font,
      color: rgb(0, 0, 0),
    });
  } else {
    console.log(`Invalid value: ${data.helpfulness}`);
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

  const surveyQuestionPositions: { [key: string]: number } = {
    SQ0: height - 380,
    SQ1: height - 394,
    SQ2: height - 410,
    SQ3: height - 430,
    SQ4: height - 446,
    SQ5: height - 464,
    SQ6: height - 480,
    SQ7: height - 496,
    SQ8: height - 515,
  };

  // Handle surveyResponses
  if (data.surveyResponses) {
    Object.entries(data.surveyResponses).forEach(([question, response]) => {
      // Get the Y position for the current question (matching SQ0, SQ1, etc.)
      const questionYPosition = surveyQuestionPositions[question];
      if (!questionYPosition) {
        console.log(`Invalid question: ${question}`);
        return;
      }

      // Update Y positions for the response options for the current question
      Object.keys(surveyResponsesCheckmarks).forEach((key) => {
        surveyResponsesCheckmarks[key].y = questionYPosition;
      });

      // Check if the response matches one of the checkmark positions
      if (response in surveyResponsesCheckmarks) {
        const checkmark = surveyResponsesCheckmarks[response as string];
        console.log(
          `Drawing survey response checkmark for ${question} at: ${checkmark.x}, ${checkmark.y}`
        );

        // Draw checkmark for the response
        firstPage.drawText("X", {
          x: checkmark.x,
          y: checkmark.y,
          size: checkmark.size,
          font: font,
          color: rgb(0, 0, 0),
        });
      } else {
        console.log(`Invalid survey response: ${response} for ${question}`);
      }
    });
  }
  const pdfBytes2 = await pdfDoc.save();
  return new Blob([pdfBytes2], { type: "application/pdf" });
}
