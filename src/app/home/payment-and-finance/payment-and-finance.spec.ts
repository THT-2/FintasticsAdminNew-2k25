import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAndFinance } from './payment-and-finance';

describe('PaymentAndFinance', () => {
  let component: PaymentAndFinance;
  let fixture: ComponentFixture<PaymentAndFinance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentAndFinance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAndFinance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
