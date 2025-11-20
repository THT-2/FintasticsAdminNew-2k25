import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantOverview } from './participant-overview';

describe('ParticipantOverview', () => {
  let component: ParticipantOverview;
  let fixture: ComponentFixture<ParticipantOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
