import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsCard } from './rewards-card';

describe('RewardsCard', () => {
  let component: RewardsCard;
  let fixture: ComponentFixture<RewardsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
