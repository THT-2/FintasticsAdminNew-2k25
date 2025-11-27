import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisGraph } from './analysis-graph';

describe('AnalysisGraph', () => {
  let component: AnalysisGraph;
  let fixture: ComponentFixture<AnalysisGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
