import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionOverview } from './transaction-overview';

describe('TransactionOverview', () => {
  let component: TransactionOverview;
  let fixture: ComponentFixture<TransactionOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
