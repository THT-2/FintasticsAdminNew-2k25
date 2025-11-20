import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCreateEdit } from './details-create-edit';

describe('DetailsCreateEdit', () => {
  let component: DetailsCreateEdit;
  let fixture: ComponentFixture<DetailsCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
