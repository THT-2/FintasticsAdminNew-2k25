import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxFiling } from './tax-filing';

describe('TaxFiling', () => {
  let component: TaxFiling;
  let fixture: ComponentFixture<TaxFiling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxFiling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxFiling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
