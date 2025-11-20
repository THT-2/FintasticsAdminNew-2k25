import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityDashboard } from './user-activity-dashboard';

describe('UserActivityDashboard', () => {
  let component: UserActivityDashboard;
  let fixture: ComponentFixture<UserActivityDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
