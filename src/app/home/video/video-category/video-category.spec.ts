import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCategory } from './video-category';

describe('VideoCategory', () => {
  let component: VideoCategory;
  let fixture: ComponentFixture<VideoCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
