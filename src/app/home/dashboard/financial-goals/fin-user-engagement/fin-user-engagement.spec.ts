import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinUserEngagement } from './fin-user-engagement';

describe('FinUserEngagement', () => {
  let component: FinUserEngagement;
  let fixture: ComponentFixture<FinUserEngagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinUserEngagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinUserEngagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
