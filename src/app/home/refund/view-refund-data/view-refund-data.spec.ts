import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRefundData } from './view-refund-data';

describe('ViewRefundData', () => {
  let component: ViewRefundData;
  let fixture: ComponentFixture<ViewRefundData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRefundData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRefundData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
