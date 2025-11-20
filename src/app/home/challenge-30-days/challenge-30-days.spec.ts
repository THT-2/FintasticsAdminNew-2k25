import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Challenge30Days } from './challenge-30-days';

describe('Challenge30Days', () => {
  let component: Challenge30Days;
  let fixture: ComponentFixture<Challenge30Days>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Challenge30Days]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Challenge30Days);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
