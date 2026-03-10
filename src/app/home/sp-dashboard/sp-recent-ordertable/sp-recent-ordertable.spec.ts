import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpRecentOrdertable } from './sp-recent-ordertable';

describe('SpRecentOrdertable', () => {
  let component: SpRecentOrdertable;
  let fixture: ComponentFixture<SpRecentOrdertable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpRecentOrdertable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpRecentOrdertable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
