import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesOverview } from './categories-overview';

describe('CategoriesOverview', () => {
  let component: CategoriesOverview;
  let fixture: ComponentFixture<CategoriesOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
