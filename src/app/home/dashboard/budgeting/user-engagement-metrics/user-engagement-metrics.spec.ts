import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEngagementMetrics } from './user-engagement-metrics';

describe('UserEngagementMetrics', () => {
  let component: UserEngagementMetrics;
  let fixture: ComponentFixture<UserEngagementMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEngagementMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEngagementMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
