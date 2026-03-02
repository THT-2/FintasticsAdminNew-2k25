import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpOrders } from './sp-orders';

describe('SpOrders', () => {
  let component: SpOrders;
  let fixture: ComponentFixture<SpOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
