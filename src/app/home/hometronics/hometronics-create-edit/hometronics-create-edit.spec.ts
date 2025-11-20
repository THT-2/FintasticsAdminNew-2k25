import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HometronicsCreateEdit } from './hometronics-create-edit';

describe('HometronicsCreateEdit', () => {
  let component: HometronicsCreateEdit;
  let fixture: ComponentFixture<HometronicsCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HometronicsCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HometronicsCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
