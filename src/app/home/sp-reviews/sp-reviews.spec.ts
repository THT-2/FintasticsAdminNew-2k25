import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpReviews } from './sp-reviews';

describe('SpReviews', () => {
  let component: SpReviews;
  let fixture: ComponentFixture<SpReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
