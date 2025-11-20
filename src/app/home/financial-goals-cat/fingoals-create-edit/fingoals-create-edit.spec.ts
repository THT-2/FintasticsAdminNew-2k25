import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingoalsCreateEdit } from './fingoals-create-edit';

describe('FingoalsCreateEdit', () => {
  let component: FingoalsCreateEdit;
  let fixture: ComponentFixture<FingoalsCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FingoalsCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FingoalsCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
