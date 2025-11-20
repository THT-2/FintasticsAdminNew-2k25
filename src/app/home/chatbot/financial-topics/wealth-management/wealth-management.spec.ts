import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WealthManagement } from './wealth-management';

describe('WealthManagement', () => {
  let component: WealthManagement;
  let fixture: ComponentFixture<WealthManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WealthManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WealthManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
