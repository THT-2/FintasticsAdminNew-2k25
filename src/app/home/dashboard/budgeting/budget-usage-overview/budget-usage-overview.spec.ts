import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetUsageOverview } from './budget-usage-overview';

describe('BudgetUsageOverview', () => {
  let component: BudgetUsageOverview;
  let fixture: ComponentFixture<BudgetUsageOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetUsageOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetUsageOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
