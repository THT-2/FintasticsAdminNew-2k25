import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTags } from './blog-tags';

describe('BlogTags', () => {
  let component: BlogTags;
  let fixture: ComponentFixture<BlogTags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogTags]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogTags);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
