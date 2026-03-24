// lib/exports/exportExcel.ts
import * as XLSX from "xlsx";

export function exportExcel({ rows, filename }:{ rows:any, filename:any } ) {
  if (!rows || rows.length === 0) return alert("No data to export.");

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename + ".xlsx");
}
