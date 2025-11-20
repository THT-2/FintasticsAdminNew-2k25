import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionUsers } from './subscription-users';

describe('SubscriptionUsers', () => {
  let component: SubscriptionUsers;
  let fixture: ComponentFixture<SubscriptionUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
