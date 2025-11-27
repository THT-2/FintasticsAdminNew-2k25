import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekCalender } from './week-calender';

describe('WeekCalender', () => {
  let component: WeekCalender;
  let fixture: ComponentFixture<WeekCalender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekCalender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekCalender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
