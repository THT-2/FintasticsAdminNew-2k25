import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinRealtime } from './fin-realtime';

describe('FinRealtime', () => {
  let component: FinRealtime;
  let fixture: ComponentFixture<FinRealtime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinRealtime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinRealtime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
