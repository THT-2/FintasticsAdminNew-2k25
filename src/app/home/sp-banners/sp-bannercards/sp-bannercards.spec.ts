import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpBannercards } from './sp-bannercards';

describe('SpBannercards', () => {
  let component: SpBannercards;
  let fixture: ComponentFixture<SpBannercards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpBannercards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpBannercards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
