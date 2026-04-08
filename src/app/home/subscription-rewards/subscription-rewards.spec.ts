import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRewards } from './subscription-rewards';

describe('SubscriptionRewards', () => {
  let component: SubscriptionRewards;
  let fixture: ComponentFixture<SubscriptionRewards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionRewards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionRewards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
