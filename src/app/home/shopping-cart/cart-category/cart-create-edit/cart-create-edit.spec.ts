import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCreateEdit } from './cart-create-edit';

describe('CartCreateEdit', () => {
  let component: CartCreateEdit;
  let fixture: ComponentFixture<CartCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
