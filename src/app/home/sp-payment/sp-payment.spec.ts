import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPayment } from './sp-payment';

describe('SpPayment', () => {
  let component: SpPayment;
  let fixture: ComponentFixture<SpPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
