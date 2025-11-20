import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicAnalytics } from './topic-analytics';

describe('TopicAnalytics', () => {
  let component: TopicAnalytics;
  let fixture: ComponentFixture<TopicAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
