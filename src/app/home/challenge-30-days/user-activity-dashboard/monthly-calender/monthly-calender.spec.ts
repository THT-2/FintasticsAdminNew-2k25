import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCalender } from './monthly-calender';

describe('MonthlyCalender', () => {
  let component: MonthlyCalender;
  let fixture: ComponentFixture<MonthlyCalender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyCalender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCalender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
