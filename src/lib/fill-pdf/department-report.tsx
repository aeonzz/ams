import React from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DateRange } from "react-day-picker";
import { formatFullName } from "../utils";
import type { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import html2canvas from "html2canvas";
import { createRoot } from 'react-dom/client';
import { DepartmentOverViewData } from "@/app/(app)/department/[departmentId]/insights/_components/types";
import RequestChart, {
  processChartData,
  TimeRange,
} from "@/app/(app)/department/[departmentId]/insights/_components/request-chart";
import DepartmentKPICards from "@/app/(app)/department/[departmentId]/insights/_components/department-kpi-cards";
import { UserWithRelations } from "prisma/generated/zod";

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

// Helper function to wrap text and return an array of lines
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const width =
      (doc.getStringUnitWidth((currentLine + " " + word).trim()) *
        doc.getFontSize()) /
      doc.internal.scaleFactor;
    if (width < maxWidth) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function captureChart(
  data: DepartmentOverViewData,
  dateRange: DateRange | undefined,
  requestType: RequestTypeType | "",
  timeRange: TimeRange,
  setTimeRange: (timeRange: TimeRange) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a container with proper styling
    const container = document.createElement("div");
    container.style.width = "1200px"; // Increased width for better resolution
    container.style.height = "450px"; // Increased height for better resolution
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.background = "white";
    container.style.padding = "20px"; // Add padding to ensure no clipping

    // Add necessary CSS variables
    container.style.cssText += `
      --chart-1: 220 70% 50%;
      --chart-2: 280 70% 50%;
      --chart-3: 30 80% 50%;
      --color-created: hsl(222.2 84% 4.9%);
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 222.2 47.4% 11.2%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 222.2 84% 4.9%;
      --radius: 0.5rem;
    `;

    document.body.appendChild(container);

    // Create a style element for additional CSS
    const style = document.createElement("style");
    style.textContent = `
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke: rgba(0, 0, 0, 0.1);
      }
      .recharts-cartesian-axis-tick-value {
        fill: rgba(0, 0, 0, 0.7);
      }
      .recharts-area-area {
        fill: url(#fillCreated) !important;
      }
      .recharts-area-curve {
        stroke-width: 2px;
      }
    `;
    document.head.appendChild(style);

    // Render the chart
    const root = document.createElement("div");
    root.style.width = "100%";
    root.style.height = "100%";
    container.appendChild(root);

    // Process the data to ensure all points are included
    const processedData = processChartData(data.requests, "day");

    // Sort data chronologically to ensure proper rendering
    const sortedData = [...processedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Create and render the chart component with processed data
    const chart = (
      <RequestChart
        data={{
          ...data,
          requests: data.requests.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        }}
        dateRange={dateRange}
        setTimeRange={setTimeRange}
        exporting
        requestType={requestType}
        timeRange={timeRange}
        className="bg-white"
      />
    );

    // Render using ReactDOM
    const reactRoot = createRoot(root);
    reactRoot.render(chart);

    // Wait longer for chart to render and capture
    setTimeout(() => {
      html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "white",
        width: container.offsetWidth,
        height: container.offsetHeight,
        onclone: (clonedDoc) => {
          // Ensure all SVG elements are properly rendered
          const svgs = clonedDoc.getElementsByTagName("svg");
          Array.from(svgs).forEach((svg) => {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
          });
        },
      })
        .then((canvas) => {
          const png = canvas.toDataURL("image/png");

          // Cleanup
          document.body.removeChild(container);
          document.head.removeChild(style);
          reactRoot.unmount(); 

          resolve(png);
        })
        .catch(reject);
    }, 2000); // Increased timeout to ensure complete rendering
  });
}

async function captureComponent(
  Component: React.ComponentType<any>,
  props: any
): Promise<string> {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    container.style.width = "1200px";
    container.style.height = "300px";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.background = "white";
    container.style.padding = "20px";

    document.body.appendChild(container);

    const componentElement = React.createElement(Component, props);
    const root = createRoot(container);
    root.render(componentElement);

    setTimeout(() => {
      html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "white",
      })
        .then((canvas) => {
          const png = canvas.toDataURL("image/png");
          document.body.removeChild(container);
          resolve(png);
        })
        .catch(reject);
    }, 1000);
  });
}

interface Data {
  data: DepartmentOverViewData;
  date: DateRange | undefined;
  requestType: RequestTypeType | "";
  currentUser: UserWithRelations;
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
  departmentName: string;
}

export const generateDepartmentReport = async ({
  data,
  date,
  requestType,
  currentUser,
  setTimeRange,
  timeRange,
  departmentName,
}: Data) => {
  const doc = new jsPDF("landscape", "pt", "a4") as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;

  const title = `Department Overview Report`;
  const dateRangeText =
    date?.from && date?.to
      ? `Date Range: ${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
      : "Date Range: Overall";
  const requestTypeText = requestType ? `Request Type: ${requestType}` : "";
  const generatedByText = `Generated by: ${formatFullName(currentUser.firstName, currentUser.middleName, currentUser.lastName)}`;
  const generatedOnText = `Generated on: ${new Date().toLocaleDateString()}`;

  // Calculate vertical position to center content
  const contentHeight = 80 + 20 + 20 + 20 + 20 + 20;
  let startY = (pageHeight - contentHeight) / 2;

  // Title - Bold and Centered
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(departmentName, pageWidth / 2, startY, { align: "center" });

  startY += 40;

  doc.text(title, pageWidth / 2, startY, { align: "center" });

  // Reset to normal font for other lines
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Date Range
  startY += 40;
  doc.text(dateRangeText, pageWidth / 2, startY, { align: "center" });

  // Request Type (if exists)
  if (requestTypeText) {
    startY += 20;
    doc.text(requestTypeText, pageWidth / 2, startY, { align: "center" });
  }

  // Generated By
  startY += 30;
  doc.text(generatedByText, pageWidth / 2, startY, { align: "center" });

  // Generated On
  startY += 20;
  doc.text(generatedOnText, pageWidth / 2, startY, { align: "center" });

  // Divider Line
  startY += 30;
  doc.setLineWidth(0.5);
  doc.line(margin, startY, pageWidth - margin, startY);

  doc.addPage();

  let kpiY = 50;
  doc.setFontSize(20).setFont("helvetica", "bold");
  doc.text("Key Performance Indicators", margin, kpiY);
  kpiY += 10;

  try {
    // Capture the KPI Cards
    const kpiImage = await captureComponent(DepartmentKPICards, {
      data,
      dateRange: date,
      requestType,
      exporting: true,
    });

    // Add KPI Cards to PDF
    doc.addImage(
      kpiImage,
      "PNG",
      margin,
      kpiY,
      pageWidth - margin * 2,
      200 // Adjust height as needed
    );

    kpiY += 120; // Adjust spacing after KPI Cards

    // Add KPI description
    doc.setFontSize(12).setFont("helvetica", "normal");
    const kpiDescription =
      "These key performance indicators provide a quick overview of the system's current state and performance.";
    const wrappedKpiDescription = wrapText(doc, kpiDescription, maxWidth);
    wrappedKpiDescription.forEach((line) => {
      doc.text(line, margin, kpiY);
      kpiY += 20;
    });
  } catch (error) {
    console.error("Error generating component images:", error);
    throw new Error("Failed to generate component images for PDF");
  }

  // // Add content starting on the next page
  // doc.addPage();

  // // Executive Summary
  // let summaryY = 50;
  // doc.setFontSize(20).setFont("helvetica", "bold");
  // doc.text("Executive Summary", margin, summaryY);

  // // Calculate metrics
  // const totalRequests = data.requests.length;
  // const completedRequests = data.requests.filter(
  //   (req) => req.status === "COMPLETED"
  // ).length;
  // const completionRate = ((completedRequests / totalRequests) * 100).toFixed(2);
  // const activeUsers = data.users.filter((user) => !user.isArchived).length;

  // // Generate AI-powered summary text
  // const prompt = `
  //   You are a report summarizer. Generate a short summary of a system overview report based on the following data:

  //   - Total Requests: ${totalRequests}
  //   - Completed Requests: ${completedRequests}
  //   - Completion Rate: ${completionRate}%
  //   - Active Users: ${activeUsers}

  //   The summary should be concise, structured in bullet points, and highlight key insights.
  // `;

  // // Get AI summary
  // const result = await generateResponseText(prompt);
  // const aiGeneratedSummary = result.success
  //   ? result.text
  //   : "Error generating AI summary.";

  // // Format summary text with proper spacing
  // doc.setFontSize(12).setFont("helvetica", "normal");
  // summaryY += 40;

  // // Add metrics with proper spacing
  // const metrics = [
  //   `• Total Requests: ${totalRequests}`,
  //   `• Completed Requests: ${completedRequests} (${completionRate}% completion rate)`,
  //   `• Active Users: ${activeUsers}`,
  // ];

  // metrics.forEach((metric) => {
  //   doc.text(metric, margin, summaryY);
  //   summaryY += 25; // Increased line spacing
  // });

  // // Add spacing before AI summary
  // summaryY += 20;

  // // Add "Summary Analysis" header
  // doc.setFont("helvetica", "bold");
  // doc.text("Summary Analysis:", margin, summaryY);
  // doc.setFont("helvetica", "normal");
  // summaryY += 25;

  // // Split AI summary into lines, wrap text, and add them with proper spacing
  // const aiSummaryLines = aiGeneratedSummary?.split("\n");
  // aiSummaryLines?.forEach((line) => {
  //   if (line.trim()) {
  //     // Wrap long lines of text
  //     const wrappedLines = wrapText(doc, line.trim(), maxWidth);
  //     wrappedLines.forEach((wrappedLine) => {
  //       doc.text(wrappedLine, margin, summaryY);
  //       summaryY += 25; // Increased line spacing
  //     });
  //   }
  // });

  // doc.addPage();

  kpiY += 10;
  doc.setFontSize(20).setFont("helvetica", "bold");
  doc.text("Requests Trend Analysis", margin, (kpiY += 10));
  kpiY += 10;

  try {
    // Capture the chart
    const chartImage = await captureChart(
      data,
      date,
      requestType,
      timeRange,
      setTimeRange
    );

    // Add chart to PDF
    doc.addImage(chartImage, "PNG", margin, kpiY, pageWidth - margin * 2, 300);

    // Add chart description
    kpiY += 300;
    doc.setFontSize(12).setFont("helvetica", "normal");
    const chartDescription = `This chart shows the daily request trends${
      requestType ? ` for ${requestType} requests` : ""
    } over time. The data reflects the period: ${
      date?.from && date?.to
        ? `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`
        : "All time"
    }.`;

    const wrappedDescription = wrapText(doc, chartDescription, maxWidth);
    wrappedDescription.forEach((line) => {
      doc.text(line, margin, kpiY);
      kpiY += 20;
    });

    // ... (rest of the PDF generation code)
  } catch (error) {
    console.error("Error generating chart image:", error);
    throw new Error("Failed to generate chart image for PDF");
  }

  doc.addPage();

  // Add the title for the table
  doc.setFontSize(20).setFont("helvetica", "bold");
  doc.text("Requests Overview", margin, 50);

  // Add table with adjusted position
  doc.autoTable({
    head: [
      ["ID", "Title", "Type", "Status", "Requester", "Created", "Completed"],
    ],
    body: data.requests.map((request) => [
      request.id,
      request.title,
      request.type,
      request.status,
      formatFullName(
        request.user.firstName,
        request.user.middleName,
        request.user.lastName
      ),
      new Date(request.createdAt).toLocaleDateString(),
      request.completedAt
        ? new Date(request.completedAt).toLocaleDateString()
        : "-",
    ]),
    margin,
    startY: 70,
    didParseCell: (data: any) => {
      if (data.row.index === 0 && data.cell.section === "head") {
        data.cell.styles.fillColor = [85, 95, 190];
      }
    },
  });

  // Save the PDF
  doc.save(`${departmentName}-overview-report.pdf`);
};
