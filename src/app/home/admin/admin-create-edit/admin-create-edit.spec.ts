import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateEdit } from './admin-create-edit';

describe('AdminCreateEdit', () => {
  let component: AdminCreateEdit;
  let fixture: ComponentFixture<AdminCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
