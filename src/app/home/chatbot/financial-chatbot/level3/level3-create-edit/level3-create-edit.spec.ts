import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level3CreateEdit } from './level3-create-edit';

describe('Level3CreateEdit', () => {
  let component: Level3CreateEdit;
  let fixture: ComponentFixture<Level3CreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level3CreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level3CreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
