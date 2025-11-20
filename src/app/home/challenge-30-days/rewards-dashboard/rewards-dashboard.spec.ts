import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsDashboard } from './rewards-dashboard';

describe('RewardsDashboard', () => {
  let component: RewardsDashboard;
  let fixture: ComponentFixture<RewardsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
