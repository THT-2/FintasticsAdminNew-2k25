import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCreateEdit } from './category-create-edit';

describe('CategoryCreateEdit', () => {
  let component: CategoryCreateEdit;
  let fixture: ComponentFixture<CategoryCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
