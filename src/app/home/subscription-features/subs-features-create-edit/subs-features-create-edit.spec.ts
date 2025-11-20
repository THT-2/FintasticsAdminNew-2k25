import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsFeaturesCreateEdit } from './subs-features-create-edit';

describe('SubsFeaturesCreateEdit', () => {
  let component: SubsFeaturesCreateEdit;
  let fixture: ComponentFixture<SubsFeaturesCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsFeaturesCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsFeaturesCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
