import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDashboard } from './blog-dashboard';

describe('BlogDashboard', () => {
  let component: BlogDashboard;
  let fixture: ComponentFixture<BlogDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
