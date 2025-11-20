import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsUpdate } from './news-update';

describe('NewsUpdate', () => {
  let component: NewsUpdate;
  let fixture: ComponentFixture<NewsUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
