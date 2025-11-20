import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCreateEdit } from './video-create-edit';

describe('VideoCreateEdit', () => {
  let component: VideoCreateEdit;
  let fixture: ComponentFixture<VideoCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
