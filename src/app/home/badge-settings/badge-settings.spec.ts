import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeSettings } from './badge-settings';

describe('BadgeSettings', () => {
  let component: BadgeSettings;
  let fixture: ComponentFixture<BadgeSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
