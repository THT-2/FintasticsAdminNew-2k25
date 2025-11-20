import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeFilter } from './challenge-filter';

describe('ChallengeFilter', () => {
  let component: ChallengeFilter;
  let fixture: ComponentFixture<ChallengeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
