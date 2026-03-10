import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User360ViewDashboard } from './user-360-view-dashboard';

describe('User360ViewDashboard', () => {
  let component: User360ViewDashboard;
  let fixture: ComponentFixture<User360ViewDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [User360ViewDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(User360ViewDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
