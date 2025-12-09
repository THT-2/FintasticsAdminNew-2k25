import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type Role = 'FinexpertHead' | 'Finexpert';
type FilterType = 'Today' | 'Last7days' | 'Last30days' | 'ThisMonth' | 'LastMonth' | 'Custom';

export interface FilterRequestBody {
  role: Role;
  filter_type: FilterType;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {

  // you can set this from parent or based on login role
  role: Role = 'Finexpert';

  filterType: FilterType = 'Today';

  // bound to custom date inputs
  startDate: string | null = null;
  endDate: string | null = null;

  // if you want to notify parent instead of directly calling API
  @Output() filterChange = new EventEmitter<FilterRequestBody>();

  constructor(private http: HttpClient) {}

  /** Called when user clicks on a preset button */
  selectPreset(type: FilterType) {
    this.filterType = type;

    // reset custom dates if user picks a preset
    if (type !== 'Custom') {
      this.startDate = null;
      this.endDate = null;
    }

    const body = this.buildRequestBody();
    this.emitOrCallApi(body);
  }

  /** Called when user clicks "Apply" for custom range */
  applyCustomRange() {
    this.filterType = 'Custom';

    const body = this.buildRequestBody();
    this.emitOrCallApi(body);
  }

  /** Build the API body based on current state */
  private buildRequestBody(): FilterRequestBody {
    const body: FilterRequestBody = {
      role: this.role,
      filter_type: this.filterType,
    };

    if (this.filterType === 'Custom') {
      // only send dates for Custom
      if (this.startDate) {
        body.startDate = this.startDate;
      }
      if (this.endDate) {
        body.endDate = this.endDate;
      }
    }

    return body;
  }

  /** Either emit to parent or call API directly */
  private emitOrCallApi(body: FilterRequestBody) {
    // Option 1: emit to parent
    this.filterChange.emit(body);

    // Option 2: call API directly (example)
    // this.http.post('/your/api/url', body).subscribe(res => {
    //   console.log('API response: ', res);
    // });
  }
}
