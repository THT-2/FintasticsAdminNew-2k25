import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCards } from './participant-cards';

describe('ParticipantCards', () => {
  let component: ParticipantCards;
  let fixture: ComponentFixture<ParticipantCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
