// lib/exports/exportPdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPdf({ title, rows, filename }: { title:any, rows: any, filename: any }) {
  if (!rows || rows.length === 0) return alert("No data to export.");

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  autoTable(doc, {
    startY: 28,
    head: [Object.keys(rows[0])],
    body: rows.map((r:any) => Object.values(r)),
  });

  doc.save(filename + ".pdf");
}
