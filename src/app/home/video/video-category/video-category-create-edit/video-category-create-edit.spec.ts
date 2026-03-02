import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCategoryCreateEdit } from './video-category-create-edit';

describe('VideoCategoryCreateEdit', () => {
  let component: VideoCategoryCreateEdit;
  let fixture: ComponentFixture<VideoCategoryCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCategoryCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCategoryCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
