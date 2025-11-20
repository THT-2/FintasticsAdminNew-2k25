import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedWinners } from './expected-winners';

describe('ExpectedWinners', () => {
  let component: ExpectedWinners;
  let fixture: ComponentFixture<ExpectedWinners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpectedWinners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectedWinners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
