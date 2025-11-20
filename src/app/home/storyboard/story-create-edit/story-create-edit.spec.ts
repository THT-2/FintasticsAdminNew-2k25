import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCreateEdit } from './story-create-edit';

describe('StoryCreateEdit', () => {
  let component: StoryCreateEdit;
  let fixture: ComponentFixture<StoryCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
