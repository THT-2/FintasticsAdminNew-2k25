import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeTracking } from './realtime-tracking';

describe('RealtimeTracking', () => {
  let component: RealtimeTracking;
  let fixture: ComponentFixture<RealtimeTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimeTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimeTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
