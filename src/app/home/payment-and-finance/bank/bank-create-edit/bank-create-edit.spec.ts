import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCreateEdit } from './bank-create-edit';

describe('BankCreateEdit', () => {
  let component: BankCreateEdit;
  let fixture: ComponentFixture<BankCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
