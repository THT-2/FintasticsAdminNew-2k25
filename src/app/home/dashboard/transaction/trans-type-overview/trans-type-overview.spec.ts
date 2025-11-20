import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransTypeOverview } from './trans-type-overview';

describe('TransTypeOverview', () => {
  let component: TransTypeOverview;
  let fixture: ComponentFixture<TransTypeOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransTypeOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransTypeOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
