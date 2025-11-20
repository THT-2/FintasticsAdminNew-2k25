import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionFeatures } from './subscription-features';

describe('SubscriptionFeatures', () => {
  let component: SubscriptionFeatures;
  let fixture: ComponentFixture<SubscriptionFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionFeatures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
