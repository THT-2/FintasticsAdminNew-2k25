import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Goal {
  id: number;
  userId: number;
  title: string;
  category: string;
  targetAmount: number;
  progress: number;
  status: 'completed' | 'abandoned' | 'in-progress';
  start: Date;
  updated: Date;
  completedAt?: Date | null;
}

interface User {
  id: number;
  name: string;
  country?: string;
  platform?: string;
  segment?: string;
}

@Component({
  selector: 'app-fin-admin',
  templateUrl: './fin-admin.html',
  styleUrls: ['./fin-admin.scss']
})
export class FinAdmin {
  // Example users/goals (replace with service/API data)
  users: User[] = [];
  goals: Goal[] = [];

  private $(id: string): HTMLElement {
    return document.getElementById(id)!;
  }

  // --- Build Excel Sheet from goals ---
  private buildGoalsSheet(rows: Goal[]) {
    const sheetData = rows.map(g => {
      const u = this.users.find(u => u.id === g.userId);
      return {
        ID: g.id,
        User: u?.name || 'Unknown',
        Country: u?.country || '',
        Platform: u?.platform || '',
        Segment: u?.segment || '',
        Title: g.title,
        Category: g.category,
        TargetAmount: g.targetAmount,
        ProgressPct: g.progress,
        Status: g.status,
        Start: g.start.toISOString(),
        Updated: g.updated.toISOString(),
        CompletedAt: g.completedAt ? g.completedAt.toISOString() : ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Goals');
    return wb;
  }

  // --- Default file name ---
  private defaultFileBase(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `goals_analytics_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  // --- Excel Export: Current view ---
  exportCurrent(rows: Goal[]): void {
    const wb = this.buildGoalsSheet(rows);
    const name = `${this.defaultFileBase()}_current.xlsx`;
    this.$('exportNameHint').textContent = name;
    XLSX.writeFile(wb, name);
  }

  // --- Excel Export: Full dataset ---
  exportFull(): void {
    const wb = this.buildGoalsSheet(this.goals);
    const name = `${this.defaultFileBase()}_full.xlsx`;
    this.$('exportNameHint').textContent = name;
    XLSX.writeFile(wb, name);
  }

  // --- PDF Export ---
  async exportPDF(): Promise<void> {
    const el = this.$('mainContent');
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#fff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgW = canvas.width * ratio;
    const imgH = canvas.height * ratio;
    const x = (pageWidth - imgW) / 2;
    const y = 20;

    pdf.addImage(imgData, 'PNG', x, y, imgW, imgH);
    const name = `${this.defaultFileBase()}.pdf`;
    this.$('exportNameHint').textContent = name;
    pdf.save(name);
  }
}
