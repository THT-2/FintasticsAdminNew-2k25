import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCoupon } from './sp-coupon';

describe('SpCoupon', () => {
  let component: SpCoupon;
  let fixture: ComponentFixture<SpCoupon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpCoupon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpCoupon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
