import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytypeCreateEdit } from './paytype-create-edit';

describe('PaytypeCreateEdit', () => {
  let component: PaytypeCreateEdit;
  let fixture: ComponentFixture<PaytypeCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaytypeCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytypeCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
