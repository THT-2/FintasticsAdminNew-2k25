import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAnalytics } from './support-analytics';

describe('SupportAnalytics', () => {
  let component: SupportAnalytics;
  let fixture: ComponentFixture<SupportAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
