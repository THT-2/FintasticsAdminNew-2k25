import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCategories } from './blog-categories';

describe('BlogCategories', () => {
  let component: BlogCategories;
  let fixture: ComponentFixture<BlogCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
