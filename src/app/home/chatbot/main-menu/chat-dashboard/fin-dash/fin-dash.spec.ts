import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinDash } from './fin-dash';

describe('FinDash', () => {
  let component: FinDash;
  let fixture: ComponentFixture<FinDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinDash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinDash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
