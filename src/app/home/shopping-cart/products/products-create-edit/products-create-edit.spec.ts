import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCreateEdit } from './products-create-edit';

describe('ProductsCreateEdit', () => {
  let component: ProductsCreateEdit;
  let fixture: ComponentFixture<ProductsCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
