import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPlanning } from './tax-planning';

describe('TaxPlanning', () => {
  let component: TaxPlanning;
  let fixture: ComponentFixture<TaxPlanning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxPlanning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxPlanning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
