import { Component, EventEmitter, Output } from '@angular/core';
import { Card } from "../../../../Z-Commons/card/card";
import { Table } from "../../../../Z-Commons/table/table";
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { Data } from '../../../../Service/data';
import { HeaderConstants } from '../../../../constants/header-constants';
import { MessageDialogue } from '../../../../Z-Commons/message-dialogue/message-dialogue';
import { GlobalConstant } from '../../../../constants/global-constants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-participant-overview',
  imports: [Card, Table],
  templateUrl: './participant-overview.html',
  styleUrl: './participant-overview.scss',
  providers:[AlertService]
})
export class ParticipantOverview implements OnInit{
  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.challenge_dashboard;

  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Banner',
    routingPath : '/admin/banners/create',
    routingView : 'View',
    // routingEdit : 'Edit',
    // routingDelete : 'Delete',
  }
  userdata: any;
  userId:any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private alertService: AlertService, private dialog: MatDialog, private cdr: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.ChallengeHeader;
  }
  ngOnInit(): void {
    this.getparticipantslist();
  }
  getparticipantslist() {
    this.loader = true;
    this.userdata = [];
    this.navService.postData(this.apiUrl, {}).subscribe({
      next: (res: any) => {
        console.log('user', res);
        if (res.code === 200) {
          this.userdata = res.user_detail;
          console.log('usertable', this.userdata);
        } else {
          this.alertService.toast('error', true, res.message);
        }
        this.loader = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.toast('error', true, error);
        this.loader = false;
      },
      complete: () => {
        this.loader = false;
      },
    });
  }


    getActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit') {
      // this.router.navigate(['/admin/banners/edit',event.data._id]);
    }
    else if (event.actions === 'View'){


    // store the user id in signal
    this.navService.setSelectedUser(event.data._id);

    // navigate to user activity module
      this.router.navigate(['/admin/user-activity-dashboard',event.data._id]);

    }
    // else if (event.actions === 'Delete'){
    //   const dialogRef = this.dialog.open(MessageDialogue, {
    //     data: {
    //       message: 'Do you want to delete this Event ?',
    //       buttonText: {
    //         ok: 'Ok',
    //         cancel: 'Close'
    //       }
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    //     if (confirmed) {
    //       let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.Banners_delete+"/"+event.data._id;
    //       this.navService.postData(apiUrl,{}).subscribe({
    //         next: (res: any) => {
    //           if (res['status'] == true) {
    //             this.alertService.toast("success",true,res.message);
    //             this.getparticipantslist();
    //           }
    //           window.location.reload();
    //         },
    //         error: (error: any) => {
    //           console.log(error);
    //           if (error.error?.message) {
    //             this.responseMessage = error.error.message;
    //           } else {
    //             this.responseMessage = GlobalConstant.genericError;
    //           }
    //         }
    //       })
    //     }
    //   })
    // }
  }



fileName = 'participants.xlsx';

exportExcel() {
  if (!this.userdata || this.userdata.length === 0) {
    console.error('No data to export');
    return;
  }

  // 1️⃣ Build data using displayName as header
  const visibleColumns = this.columnDefinition.filter(
    (col: any) => col.name !== 'actions' // skip actions column from Excel
  );

  const dataToExport = this.userdata.map((row: any) => {
    const obj: any = {};

    visibleColumns.forEach((col: any) => {
      const backendKey = col.name;          // e.g. "username"
      const headerText = col.displayName;   // e.g. "Participant"

      obj[headerText] = row[backendKey];
    });

    return obj;
  });

  // 2️⃣ Create worksheet from data
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

  // 3️⃣ Auto-fit column widths based on header + cell content
  const colWidths = visibleColumns.map((col: any) => {
    const header = col.displayName || col.name;
    let maxLen = header.length;

    this.userdata.forEach((row: any) => {
      const value = row[col.name];
      if (value !== null && value !== undefined) {
        const len = String(value).length;
        if (len > maxLen) maxLen = len;
      }
    });

    return { wch: maxLen + 2 }; // extra padding
  });

  ws['!cols'] = colWidths;

  // 4️⃣ Make header row bold & centered (if your XLSX build supports styles)
  visibleColumns.forEach((col: any, colIndex: number) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex }); // header row is r:0
    const cell = ws[cellRef];
    if (cell) {
      cell.s = {
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
  });

  // 5️⃣ Create workbook & save
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Participants');

  XLSX.writeFile(wb, this.fileName);
}



}



