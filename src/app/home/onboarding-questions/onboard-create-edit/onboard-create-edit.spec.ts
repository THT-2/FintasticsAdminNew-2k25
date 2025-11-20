import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCreateEdit } from './onboard-create-edit';

describe('OnboardCreateEdit', () => {
  let component: OnboardCreateEdit;
  let fixture: ComponentFixture<OnboardCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
