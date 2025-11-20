import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsNdTrends } from './charts-nd-trends';

describe('ChartsNdTrends', () => {
  let component: ChartsNdTrends;
  let fixture: ComponentFixture<ChartsNdTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsNdTrends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsNdTrends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
