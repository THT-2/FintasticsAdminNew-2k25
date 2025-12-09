import { ChangeDetectorRef, Component } from '@angular/core';
import { Filter, FilterRequestBody } from "../../filter/filter";
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { AlertService } from '../../../../../constants/alertservice';
import { Data } from '../../../../../Service/data';

@Component({
  selector: 'app-fin-dash',
  templateUrl: './fin-dash.html',
  styleUrls: ['./fin-dash.scss'],
  imports: [Filter],
  providers:[AlertService]
})
export class FinDash {

  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.dashboard_cards;

  cards: any = null;

  constructor(
    private navservice: Data,
    private cd: ChangeDetectorRef,
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  onFilterApplied(filterBody: FilterRequestBody) {
    console.log("Filter applied:", filterBody);
    this.getCardsData(filterBody);
  }


  getCardsData(filterBody: any) {
    this.navservice.postData(this.apiUrl, filterBody).subscribe({
      next: (res: any) => {
        console.log("cards", res);
        if (res.code === 200) {
          this.cards = res.chat_dashboard;
          console.log("newcards", this.cards);
        } else {
          this.alertService.toast("error", true, res.message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.alertService.toast("error", true, error);
      }
    });
  }
}
