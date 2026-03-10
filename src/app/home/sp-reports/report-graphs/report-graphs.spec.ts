import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGraphs } from './report-graphs';

describe('ReportGraphs', () => {
  let component: ReportGraphs;
  let fixture: ComponentFixture<ReportGraphs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportGraphs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportGraphs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
