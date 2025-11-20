import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCategory } from './cart-category';

describe('CartCategory', () => {
  let component: CartCategory;
  let fixture: ComponentFixture<CartCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
