import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinCategory } from './fin-category';

describe('FinCategory', () => {
  let component: FinCategory;
  let fixture: ComponentFixture<FinCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
