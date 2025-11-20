import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCreateEdit } from './sub-create-edit';

describe('SubCreateEdit', () => {
  let component: SubCreateEdit;
  let fixture: ComponentFixture<SubCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
