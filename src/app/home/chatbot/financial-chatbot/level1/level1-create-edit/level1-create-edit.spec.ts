import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level1CreateEdit } from './level1-create-edit';

describe('Level1CreateEdit', () => {
  let component: Level1CreateEdit;
  let fixture: ComponentFixture<Level1CreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level1CreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level1CreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
