import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '../../Service/data';
import { AlertService } from '../../constants/alertservice';
import { ApiRoutesConstants } from '../../constants/api-route-constants';
import { HeaderConstants } from '../../constants/header-constants';
import { Card } from '../../Z-Commons/card/card';
import { Table } from '../../Z-Commons/table/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-data',
  imports: [CommonModule, FormsModule, Card, Table],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
  providers: [AlertService]
})
export class UserData implements OnInit {

  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.user_data;
  public loader: boolean = true;

  userData: any[] = [];
  columnDefinition: any[];
  userdata: any;

  // Filter fields
  fromdate: string = '';
  todate: string = '';
  fromtime: string = '';
  totime: string = '';
  type: string = 'subscription'; // default type

  errorMessage: string = '';

  constructor(
    private navService: Data,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private dialog: MatDialog,
    private cd : ChangeDetectorRef
  ) {
    this.columnDefinition = HeaderConstants.UserData;
  }

  ngOnInit(): void {
    this.getuserdata(); // Load all initially
  }

  // ===============================
  // GET USER DATA (WITH FILTER)
  // ===============================
  getuserdata() {
    this.loader = true;
    this.userData = [];

    const requestBody = {
      fromdate: this.fromdate,
      todate: this.todate,
      fromtime: this.fromtime,
      totime: this.totime,
      type: this.type
    };

    this.navService.postData(this.apiUrl, requestBody).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.userData = [...res.data];
          console.log('usertable', this.userData);
        } else {
          this.alertService.toast("error", true, res.message);
        }
        this.loader = false;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.toast("error", true, error);
      },
      
    });
  }

  // ===============================
  // APPLY FILTER
  // ===============================
  applyFilter() {
    if (!this.validateDates()) return;
    this.getuserdata();
  }

  // ===============================
  // CLEAR FILTER
  // ===============================
  clearFilter() {
    this.fromdate = '';
    this.todate = '';
    this.fromtime = '';
    this.totime = '';
    this.type = 'subscription';
    this.errorMessage = '';
    this.getuserdata();
  }

  // ===============================
  // QUICK SELECT
  // ===============================
  quickSelect(range: string) {
    const today = new Date();

    switch (range) {
      case 'today':
        this.setDateRange(today, today);
        this.fromtime = '00:00';
        this.totime = '23:59';
        break;

      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.setDateRange(tomorrow, tomorrow);
        break;

      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        this.setDateRange(weekStart, weekEnd);
        break;

      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.setDateRange(monthStart, monthEnd);
        break;
    }
  }

  setDateRange(start: Date, end: Date) {
    this.fromdate = this.formatDate(start);
    this.todate = this.formatDate(end);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ===============================
  // VALIDATION
  // ===============================
  validateDates(): boolean {

    if (this.fromdate && this.todate && this.fromdate > this.todate) {
      this.errorMessage = 'End date must be after start date';
      return false;
    }

    if (this.fromdate === this.todate) {
      if (this.fromtime && this.totime && this.fromtime > this.totime) {
        this.errorMessage = 'End time must be after start time';
        return false;
      }
    }

    this.errorMessage = '';
    return true;
  }

  
  fileName = 'userlist.xlsx';
  
  exportExcel() {
  if (!this.userData || this.userData.length === 0) {
    console.error('No data to export');
    this.alertService.toast('error', true, 'No data to export');
    return;
  }

  // Filter out unwanted columns (like actions)
  const visibleColumns = this.columnDefinition.filter(
    (col: any) => col.name !== 'actions'
  );

  // Map data for export
  const dataToExport = this.userData.map((row: any) => {
    const obj: any = {};
    visibleColumns.forEach((col: any) => {
      const backendKey = col.name;
      const headerText = col.displayName || col.name;
      obj[headerText] = row[backendKey];
    });
    return obj;
  });

  // Create worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

  // Auto-fit column widths
  const colWidths = visibleColumns.map((col: any) => {
    const header = col.displayName || col.name;
    let maxLen = header.length;

    this.userData.forEach((row: any) => {
      const value = row[col.name];
      if (value !== null && value !== undefined) {
        const len = String(value).length;
        if (len > maxLen) maxLen = len;
      }
    });

    return { wch: maxLen + 2 }; // padding
  });

  ws['!cols'] = colWidths;

  // Create workbook & save
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'UserData');

  XLSX.writeFile(wb, this.fileName);
}

  

}
