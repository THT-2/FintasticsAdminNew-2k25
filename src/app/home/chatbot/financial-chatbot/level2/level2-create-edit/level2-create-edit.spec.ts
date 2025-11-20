import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level2CreateEdit } from './level2-create-edit';

describe('Level2CreateEdit', () => {
  let component: Level2CreateEdit;
  let fixture: ComponentFixture<Level2CreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Level2CreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level2CreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
