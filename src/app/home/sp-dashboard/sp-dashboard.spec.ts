import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpDashboard } from './sp-dashboard';

describe('SpDashboard', () => {
  let component: SpDashboard;
  let fixture: ComponentFixture<SpDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
