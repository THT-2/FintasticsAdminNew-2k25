import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCreateEdit } from './loan-create-edit';

describe('LoanCreateEdit', () => {
  let component: LoanCreateEdit;
  let fixture: ComponentFixture<LoanCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
