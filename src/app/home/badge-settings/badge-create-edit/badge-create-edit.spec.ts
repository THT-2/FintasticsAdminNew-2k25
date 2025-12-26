import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeCreateEdit } from './badge-create-edit';

describe('BadgeCreateEdit', () => {
  let component: BadgeCreateEdit;
  let fixture: ComponentFixture<BadgeCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
