import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsList } from './participants-list';

describe('ParticipantsList', () => {
  let component: ParticipantsList;
  let fixture: ComponentFixture<ParticipantsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
