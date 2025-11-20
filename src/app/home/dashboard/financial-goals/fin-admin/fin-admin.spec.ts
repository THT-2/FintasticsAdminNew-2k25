import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinAdmin } from './fin-admin';

describe('FinAdmin', () => {
  let component: FinAdmin;
  let fixture: ComponentFixture<FinAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
