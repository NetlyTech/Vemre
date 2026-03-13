// lib/exports/exportCsv.ts

function escapeCell(value: unknown): string {
  const str = value == null ? "" : String(value)
  // Wrap in quotes if the value contains a comma, double-quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportCsv({ rows, filename }: { rows: Record<string, unknown>[]; filename: string }) {
  if (!rows || rows.length === 0) return alert("No data to export.")

  const headers = Object.keys(rows[0]).map(escapeCell).join(",")
  const body = rows
    .map(r => Object.values(r).map(escapeCell).join(","))
    .join("\n")

  const csv = headers + "\n" + body
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }) // BOM for Excel UTF-8
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename + ".csv"
  link.click()
  URL.revokeObjectURL(link.href)
}
