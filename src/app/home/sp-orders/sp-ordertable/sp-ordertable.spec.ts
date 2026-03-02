import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpOrdertable } from './sp-ordertable';

describe('SpOrdertable', () => {
  let component: SpOrdertable;
  let fixture: ComponentFixture<SpOrdertable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpOrdertable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpOrdertable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
