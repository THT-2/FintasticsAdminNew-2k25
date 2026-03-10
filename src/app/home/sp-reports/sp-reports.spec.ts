import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpReports } from './sp-reports';

describe('SpReports', () => {
  let component: SpReports;
  let fixture: ComponentFixture<SpReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
