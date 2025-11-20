import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinDashCards } from './fin-dash-cards';

describe('FinDashCards', () => {
  let component: FinDashCards;
  let fixture: ComponentFixture<FinDashCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinDashCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinDashCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
