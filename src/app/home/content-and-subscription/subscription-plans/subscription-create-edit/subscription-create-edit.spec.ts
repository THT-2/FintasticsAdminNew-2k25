import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCreateEdit } from './subscription-create-edit';

describe('SubscriptionCreateEdit', () => {
  let component: SubscriptionCreateEdit;
  let fixture: ComponentFixture<SubscriptionCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
