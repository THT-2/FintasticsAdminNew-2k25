import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingQuestions } from './onboarding-questions';

describe('OnboardingQuestions', () => {
  let component: OnboardingQuestions;
  let fixture: ComponentFixture<OnboardingQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
