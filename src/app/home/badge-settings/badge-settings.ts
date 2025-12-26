import { Component } from '@angular/core';
import { Card } from "../../Z-Commons/card/card";
import { Table } from "../../Z-Commons/table/table";
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiRoutesConstants } from '../../constants/api-route-constants';
import { AlertService } from '../../constants/alertservice';
import { GlobalConstant } from '../../constants/global-constants';
import { HeaderConstants } from '../../constants/header-constants';
import { MessageDialogue } from '../../Z-Commons/message-dialogue/message-dialogue';
import { Data } from '../../Service/data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


type ExampleRow = {
  coins: number;
  rupees: number;
  paise: number;
};


@Component({
  selector: 'app-badge-settings',
  imports: [Card, Table,CommonModule,FormsModule],
  templateUrl: './badge-settings.html',
  styleUrl: './badge-settings.scss',
  providers:[AlertService]
})
export class BadgeSettings implements OnInit{

  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.badgelist;
  public loader:boolean = true;
  buttondata= {
    buttonName : 'Add New Badge',
    routingPath : '/admin/badge-settings/create',
    // routingView : 'View',
    routingEdit : 'Edit',
    routingDelete : 'Delete',
  }
  badge: any;
  columnDefinition: any[];
  responseMessage: any;

  constructor(private navService: Data, private router: Router,private route :ActivatedRoute,
    private alertService: AlertService, private dialog: MatDialog, private cdr: ChangeDetectorRef){
    this.columnDefinition = HeaderConstants.BadgeHeader;
  }
  ngOnInit(): void {
    this.getdata();
    this.rebuildExamples();
  }
    getdata(){
    this.loader = true;
    this.badge = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log('badge',res);

        if (res.code === 200) {
          this.badge = res.data;
          console.log('badge2',this.badge);
          this.buttondata = this.buttondata;
        }
        else {
          this.alertService.toast("error",true,res.message);
        }
        this.loader=false;
        this.cdr.detectChanges();
      },
      error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      },
      complete: () => {
        this.loader = false;
      }
    })
  }

    getActions(event:any){
    console.log("data",event);
    if (event.actions === 'Edit') {
      this.router.navigate(['/admin/badge-settings/edit',event.data._id]);
    }else if (event.actions === 'View'){
      // this.router.navigate(['/beta/clientView'], { queryParams: { id: event.data.clientId,type:"client" }, relativeTo: this.route });
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
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.badgelist_delete;
           const body = {
    _id: event.data._id
  };
          this.navService.postData(apiUrl,body).subscribe({
            next: (res: any) => {
              if (res['status'] == true) {
                this.alertService.toast("success",true,res.message);
                this.getdata();
              }
              window.location.reload();
            },
            error: (error: any) => {
              console.log(error);
              if (error.error?.message) {
                this.responseMessage = error.error.message;
              } else {
                this.responseMessage = GlobalConstant.genericError;
              }
            }
          })
        }
      })
    }
  }



  // Defaults
  private readonly defaultRate = 0.5; // ₹0.50 per coin

  // Current saved rate (what display uses)
  exchangeRate = this.defaultRate;

  // Input model (editable field)
  exchangeRateInput: number = this.defaultRate;

  // Examples
  examples: ExampleRow[] = [];



  get exchangeRatePaise(): number {
    // 1 rupee = 100 paise
    return Math.round(this.exchangeRate * 100);
  }

  onRateChange(value: number): void {
    // Keep input clean, but don't save yet
    const v = Number(value);
    if (!Number.isFinite(v)) return;

    // Optional clamp
    const clamped = Math.min(10, Math.max(0.01, v));
    this.exchangeRateInput = clamped;
  }

  saveRate(): void {
    // Persist the input into the current exchange rate
    const v = Number(this.exchangeRateInput);

    if (!Number.isFinite(v) || v < 0.01 || v > 10) {
      alert('Please enter a valid exchange rate between 0.01 and 10.');
      return;
    }

    this.exchangeRate = Number(v.toFixed(2));
    this.rebuildExamples();
    alert(`Exchange rate saved: 1 Fin Coin = ₹${this.exchangeRate.toFixed(2)}`);
  }

  resetToDefault(): void {
    this.exchangeRate = this.defaultRate;
    this.exchangeRateInput = this.defaultRate;
    this.rebuildExamples();
    alert('Exchange rate reset to default.');
  }

  saveSettings(): void {
    // Hook this to API later
    alert('Settings saved (connect to API in real app).');
  }

  private rebuildExamples(): void {
    // Choose your sample coin amounts
    const coinSamples = [1, 5, 10, 25, 50, 100, 250, 500];

    this.examples = coinSamples.map((coins) => {
      const rupees = coins * this.exchangeRate;
      const paise = Math.round(rupees * 100);
      return {
        coins,
        rupees,
        paise,
      };
    });
  }
}




