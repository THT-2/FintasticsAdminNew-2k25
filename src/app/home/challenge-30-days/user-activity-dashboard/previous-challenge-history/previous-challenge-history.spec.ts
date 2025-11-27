import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousChallengeHistory } from './previous-challenge-history';

describe('PreviousChallengeHistory', () => {
  let component: PreviousChallengeHistory;
  let fixture: ComponentFixture<PreviousChallengeHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousChallengeHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousChallengeHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
