import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsDashboard } from './participants-dashboard';

describe('ParticipantsDashboard', () => {
  let component: ParticipantsDashboard;
  let fixture: ComponentFixture<ParticipantsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
