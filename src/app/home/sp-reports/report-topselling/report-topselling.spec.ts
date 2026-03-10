import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTopselling } from './report-topselling';

describe('ReportTopselling', () => {
  let component: ReportTopselling;
  let fixture: ComponentFixture<ReportTopselling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTopselling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTopselling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
