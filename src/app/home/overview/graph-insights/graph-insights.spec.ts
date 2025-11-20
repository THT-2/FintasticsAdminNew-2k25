import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphInsights } from './graph-insights';

describe('GraphInsights', () => {
  let component: GraphInsights;
  let fixture: ComponentFixture<GraphInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
