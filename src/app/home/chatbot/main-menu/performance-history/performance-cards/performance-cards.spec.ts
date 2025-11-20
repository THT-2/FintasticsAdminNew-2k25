import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceCards } from './performance-cards';

describe('PerformanceCards', () => {
  let component: PerformanceCards;
  let fixture: ComponentFixture<PerformanceCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
