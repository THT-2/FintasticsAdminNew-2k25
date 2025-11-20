import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Card } from "../../../../Z-Commons/card/card";
import { Table } from "../../../../Z-Commons/table/table";
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { MessageDialogue } from '../../../../Z-Commons/message-dialogue/message-dialogue';
import { Data } from '../../../../Service/data';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderConstants } from '../../../../constants/header-constants';
import { AlertService } from '../../../../constants/alertservice';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstant } from '../../../../constants/global-constants';

@Component({
  selector: 'app-subscribed-users',
  imports: [CommonModule, Card, Table],
  templateUrl: './subscribed-users.html',
  styleUrls: ['./subscribed-users.scss'],
  providers: [AlertService],
})
export class SubscribedUsers {
  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SubscriptionUsers;

  public loader: boolean = true;

  buttondata = {
    buttonName: 'Add New Subscriber',
    routingPath: '/admin/subscribed/create',
    routingView: 'View',
    routingEdit: 'Edit',
    routingDelete: 'Delete',
  };

  userData: any;
  columnDefinition: any[];
  responseMessage: any;

  private skip = 0;
  private limit = 20;

  constructor(
    private navService: Data,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {
    this.columnDefinition = HeaderConstants.SubscribedUsersHeader;
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.loader = true;
    this.userData = [];

    this.navService.getuserData(this.apiUrl, { skip: this.skip, limit: this.limit }).subscribe({
      next: (res: any) => {
        if (res?.code === 200 || res?.success === true) {
          this.userData = res.data?.rows ?? res.data ?? res.result ?? [];
          console.log("userData",this.userData);

        } else {
          this.alertService.toast("error", true, res?.message || 'Unexpected response');
        }
        this.loader = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
        const msg = error?.error?.message || error?.message || 'Request failed';
        this.alertService.toast("error", true, msg);
        this.loader = false;
      }
    });
  }

  getActions(event: any) {
    console.log("data", event);

    if (event.actions === 'Edit') {
      this.router.navigate(['/admin/subscribed/edit', event.data._id]);
    } else if (event.actions === 'View') {
      // this.router.navigate(['/beta/clientView'], { queryParams: { id: event.data.clientId, type: "client" }, relativeTo: this.route });
    } else if (event.actions === 'Delete') {
      const dialogRef = this.dialog.open(MessageDialogue, {
        data: {
          message: 'Do you want to delete this Event ?',
          buttonText: {
            ok: 'Ok',
            cancel: 'Close'
          }
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.DELETE;
          this.navService.postData(apiUrl, { _id: event.data._id }).subscribe({
            next: (res: any) => {
              if (res['status'] === true) {
                this.alertService.toast("success", true, res.message);
                this.getUser();
              }
            },
            error: (error: any) => {
              console.log(error);
              if (error.error?.message) {
                this.responseMessage = error.error.message;
              } else {
                this.responseMessage = GlobalConstant.genericError;
              }
            }
          });
        }
      });
    }
  }
}
