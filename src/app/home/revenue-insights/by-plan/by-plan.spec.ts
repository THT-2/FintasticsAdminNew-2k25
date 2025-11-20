import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByPlan } from './by-plan';

describe('ByPlan', () => {
  let component: ByPlan;
  let fixture: ComponentFixture<ByPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
