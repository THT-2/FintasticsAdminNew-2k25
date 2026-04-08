import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRewardsCreateEdit } from './subscription-rewards-create-edit';

describe('SubscriptionRewardsCreateEdit', () => {
  let component: SubscriptionRewardsCreateEdit;
  let fixture: ComponentFixture<SubscriptionRewardsCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionRewardsCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionRewardsCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
