import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialGoalsCat } from './financial-goals-cat';

describe('FinancialGoalsCat', () => {
  let component: FinancialGoalsCat;
  let fixture: ComponentFixture<FinancialGoalsCat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialGoalsCat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialGoalsCat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
