import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuesCreateEdit } from './dues-create-edit';

describe('DuesCreateEdit', () => {
  let component: DuesCreateEdit;
  let fixture: ComponentFixture<DuesCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuesCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuesCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
