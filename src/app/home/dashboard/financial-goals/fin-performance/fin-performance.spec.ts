import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinPerformance } from './fin-performance';

describe('FinPerformance', () => {
  let component: FinPerformance;
  let fixture: ComponentFixture<FinPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinPerformance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
