// lib/exports/exportDocx.ts
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

export async function exportDocx({ title, rows, filename }:{ title:any, rows:any, filename:any }) {
  if (!rows || rows.length === 0) return alert("No data to export.");

  const headerRow = new TableRow({
    children: Object.keys(rows[0]).map(
      (key) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: key, bold: true })],
            }),
          ],
        })
    ),
  });

  const dataRows = rows.map(
    (r:any) =>
      new TableRow({
        children: Object.values(r).map(
          (val) =>
            new TableCell({
              children: [new Paragraph(String(val))],
            })
        ),
      })
  );

  const table = new Table({
    rows: [headerRow, ...dataRows],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: title, bold: true, size: 32 }),
            ],
          }),
          new Paragraph(" "),
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename + ".docx");
}
