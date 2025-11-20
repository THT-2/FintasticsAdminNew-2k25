import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueInsights } from './revenue-insights';

describe('RevenueInsights', () => {
  let component: RevenueInsights;
  let fixture: ComponentFixture<RevenueInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
