import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level4CreateEdit } from './level4-create-edit';

describe('Level4CreateEdit', () => {
  let component: Level4CreateEdit;
  let fixture: ComponentFixture<Level4CreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level4CreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level4CreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
