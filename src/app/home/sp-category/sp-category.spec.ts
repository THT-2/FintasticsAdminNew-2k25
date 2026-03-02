import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCategory } from './sp-category';

describe('SpCategory', () => {
  let component: SpCategory;
  let fixture: ComponentFixture<SpCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
