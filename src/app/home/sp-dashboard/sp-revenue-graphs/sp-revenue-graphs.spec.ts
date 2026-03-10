import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpRevenueGraphs } from './sp-revenue-graphs';

describe('SpRevenueGraphs', () => {
  let component: SpRevenueGraphs;
  let fixture: ComponentFixture<SpRevenueGraphs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpRevenueGraphs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpRevenueGraphs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
