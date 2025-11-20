import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPerformers } from './top-performers';

describe('TopPerformers', () => {
  let component: TopPerformers;
  let fixture: ComponentFixture<TopPerformers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPerformers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPerformers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
