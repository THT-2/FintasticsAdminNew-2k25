import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpProducts } from './sp-products';

describe('SpProducts', () => {
  let component: SpProducts;
  let fixture: ComponentFixture<SpProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
