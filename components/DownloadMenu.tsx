"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import { exportPdf } from "@/lib/exports/exportPdf";
import { exportDocx } from "@/lib/exports/exportDocx";
import { exportCsv } from "@/lib/exports/exportCsv";
import { exportExcel } from "@/lib/exports/exportExcel";

interface DownloadMenuProps {
  title: string;
  filename: string;
  rows: any[];
}

export default function DownloadMenu({
  title,
  filename,
  rows,
}: DownloadMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={() => exportPdf({ title, rows, filename })}>
          Download PDF
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportDocx({ title, rows, filename })}>
          Download DOCX
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportCsv({ rows, filename })}>
          Download CSV
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportExcel({ rows, filename })}>
          Download Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
