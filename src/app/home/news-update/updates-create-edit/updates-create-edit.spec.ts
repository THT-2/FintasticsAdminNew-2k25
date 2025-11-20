import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesCreateEdit } from './updates-create-edit';

describe('UpdatesCreateEdit', () => {
  let component: UpdatesCreateEdit;
  let fixture: ComponentFixture<UpdatesCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatesCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatesCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
