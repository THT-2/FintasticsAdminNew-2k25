import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpCustomers } from './sp-customers';

describe('SpCustomers', () => {
  let component: SpCustomers;
  let fixture: ComponentFixture<SpCustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpCustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpCustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
