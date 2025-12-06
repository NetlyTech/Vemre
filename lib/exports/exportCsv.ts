// lib/exports/exportCsv.ts
export function exportCsv({ rows, filename }: { rows:any, filename:any }) {
  if (!rows || rows.length === 0) return alert("No data to export.");

  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map((r:any) => Object.values(r).join(",")).join("\n");

  const csv = headers + "\n" + body;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename + ".csv";
  link.click();
}
