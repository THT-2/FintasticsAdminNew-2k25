import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpOverviewcards } from './sp-overviewcards';

describe('SpOverviewcards', () => {
  let component: SpOverviewcards;
  let fixture: ComponentFixture<SpOverviewcards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpOverviewcards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpOverviewcards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
