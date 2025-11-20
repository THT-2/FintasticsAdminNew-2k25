import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushCreateEdit } from './push-create-edit';

describe('PushCreateEdit', () => {
  let component: PushCreateEdit;
  let fixture: ComponentFixture<PushCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
