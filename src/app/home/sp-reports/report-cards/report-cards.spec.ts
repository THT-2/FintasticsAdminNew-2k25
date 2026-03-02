import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCards } from './report-cards';

describe('ReportCards', () => {
  let component: ReportCards;
  let fixture: ComponentFixture<ReportCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
