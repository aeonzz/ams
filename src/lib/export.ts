import { type Table } from "@tanstack/react-table";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { textTransform } from "./utils";

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string;
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | "select" | "actions")[];

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as any));

  const transformedHeaders = headers.map((header) => textTransform(header));

  // Build CSV content
  const csvContent = [
    transformedHeaders.join(),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header);
          if (cellValue instanceof Date) {
            return `"${format(cellValue, "PP p")}"`; // Format as 'Nov 11, 2024 4:00 PM'
          }

          if (typeof cellValue === "boolean") {
            return cellValue ? "Yes" : "No"; // Handle boolean values
          }

          // Handle array values
          if (Array.isArray(cellValue)) {
            return `"${cellValue.join(", ")}"`; // Join array values with commas
          }

          // Handle object values
          if (typeof cellValue === "object" && cellValue !== null) {
            return `"${JSON.stringify(cellValue).replace(/"/g, '""')}"`; // Escape quotes
          }

          // Handle string values
          if (typeof cellValue === "string") {
            return `"${cellValue.replace(/"/g, '""')}"`; // Escape quotes in strings
          }

          // Handle numbers or other primitive values
          return `"${cellValue ?? ""}"`;
        })
        .join(",")
    ),
  ].join("\n");

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTableToXLSX<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {}
): void {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as any));

  const transformedHeaders = headers.map((header) => textTransform(header));

  const data = [
    transformedHeaders,
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers.map((header) => {
        const cellValue = row.getValue(header);
        if (cellValue instanceof Date) {
          return `${format(cellValue, "PP p")}`;
        } else if (typeof cellValue === "boolean") {
          return cellValue ? "Yes" : "No";
        } else if (Array.isArray(cellValue)) {
          return cellValue
            .map((item) => textTransform(String(item)))
            .join(", ");
        } else if (typeof cellValue === "object" && cellValue !== null) {
          return textTransform(JSON.stringify(cellValue));
        } else if (typeof cellValue === "string") {
          return textTransform(cellValue);
        } else {
          return cellValue;
        }
      })
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, `${filename}.xlsx`);
}
