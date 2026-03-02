import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAbandonedcart } from './report-abandonedcart';

describe('ReportAbandonedcart', () => {
  let component: ReportAbandonedcart;
  let fixture: ComponentFixture<ReportAbandonedcart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportAbandonedcart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAbandonedcart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
