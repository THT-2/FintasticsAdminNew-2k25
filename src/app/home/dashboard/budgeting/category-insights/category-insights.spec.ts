import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryInsights } from './category-insights';

describe('CategoryInsights', () => {
  let component: CategoryInsights;
  let fixture: ComponentFixture<CategoryInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
