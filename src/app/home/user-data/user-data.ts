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
import { MessageDialogue } from '../../Z-Commons/message-dialogue/message-dialogue';
import { GlobalConstant } from '../../constants/global-constants';

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
  responseMessage: any;

  // Filter fields
  fromdate: string = '';
  todate: string = '';
  fromtime: string = '';
  totime: string = '';
  type: string = ''; // default type
  activeQuick: string = 'today';

  errorMessage: string = '';
buttondata= {
    routingView : 'View',
    // routingEdit : 'Edit',
    // routingDelete : 'Delete',
  }

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
    this.quickSelect('today');
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
    this.type = '';
    this.errorMessage = '';
    this.getuserdata();

  }

  // ===============================
  // QUICK SELECT
  // ===============================
quickSelect(range: string) {
  this.activeQuick = range; // 👈 track active button

  const today = new Date();

  switch (range) {
    case 'today':
      this.setDateRange(today, today);
      this.fromtime = '09:00';
      this.totime = '19:00';
      break;

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      this.setDateRange(yesterday, yesterday);
      this.fromtime = '09:00';
      this.totime = '19:00';
      break;

    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      this.setDateRange(weekStart, weekEnd);
      this.fromtime = '09:00';
      this.totime = '19:00';
      break;

    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.setDateRange(monthStart, monthEnd);
      this.fromtime = '09:00';
      this.totime = '19:00';
      break;
  }

  this.applyFilter();
}
  onTypeChange() {
  this.applyFilter();
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

    getActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit') {
      this.router.navigate(['/admin/user-data/edit',event.data._id]);
    }else if (event.actions === 'View'){
      console.log("view",event.data._id);
      
      this.router.navigate(['/admin/user-data/view',event.data._id]);
    }else if (event.actions === 'Delete'){
      const dialogRef = this.dialog.open(MessageDialogue, {
        data: {
          message: 'Do you want to delete this Event ?',
          buttonText: {
            ok: 'Ok',
            cancel: 'Close'
          }
        }
      });
      // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      //   if (confirmed) {
      //     let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.StoryBoardDelete + '/' + event.data._id;
      //     this.navService.postData(apiUrl,{}).subscribe({
      //       next: (res: any) => {
      //         if (res['Status'] == 'Success') {
      //           this.alertService.toast("success",true,res.Message);
      //           this.getuserdata();
      //         }
      //       },
      //       error: (error: any) => {
      //         console.log(error);
      //         if (error.error?.message) {
      //           this.responseMessage = error.error.message;
      //         } else {
      //           this.responseMessage = GlobalConstant.genericError;
      //         }
      //       }
      //     })
      //   }
      // })
    }
  }
}
