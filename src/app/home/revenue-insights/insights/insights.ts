import { ChangeDetectorRef, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Filter, ServerFilterPayload } from '../../dashboard/filter/filter';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';


type QuickKey = 'today' | 'yesterday' | '7d' | '30d' | 'ytd' | 'custom';

const KEY_TO_SERVER: Record<QuickKey, ServerFilterPayload['filter_type']> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7d': 'Last7days',
  '30d': 'Last30days',
  ytd: 'Lastyear',
  custom: 'Custom',
};

@Component({
  selector: 'app-insights',
  imports: [Filter, NgFor],
  templateUrl: './insights.html',
  styleUrl: './insights.scss',
  providers: [AlertService]
})
export class Insights {
  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SubscriptionPlans;

  plans: any;
  planData: any;
  overAll_amount: any;
  initialServerFilter: ServerFilterPayload = { filter_type: 'Today' };

  constructor(
    private navService: Data,
    private alertService: AlertService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = this.trunc(new Date());
    const start = this.shiftDays(today, -29);
    this.getplans({
      filter_type: 'Today',
      startDate: this.toISO(today),
      endDate: this.toISO(today),
    });
  }

  onRangeApplied(e: { start: Date; end: Date; key: QuickKey; label: string }) {
    const payload = this.toServerPayload(e);
    this.getplans(payload);
  }

  private toServerPayload(e: { start: Date; end: Date; key: QuickKey }): ServerFilterPayload {
    const filter_type = KEY_TO_SERVER[e.key];
    return {
      filter_type,
      startDate: this.toISO(e.start),
      endDate: this.toISO(e.end),
    };
  }

  getplans(body: ServerFilterPayload) {
    this.navService.postData(this.apiUrl, body).subscribe({
      next: (res: any) => {
        console.log("plans", res);
        if (res.code === 200) {
          this.plans = res.data?.subscription_filter ?? 0;
          this.overAll_amount = res.data?.overAll_amount ?? 0;
          console.log('SubsPlans', this.plans);
        }
         else {
          this.alertService.toast("error", true, res.message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.alertService.toast("error", true, error);
      }
    });
  }

  trackByIndex(i: number) { return i; }

  private toISO(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  private trunc(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  private shiftDays(base: Date, delta: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + delta);
    return this.trunc(d);
  }
}
