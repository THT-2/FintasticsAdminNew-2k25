import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSettings } from './ad-settings';

describe('AdSettings', () => {
  let component: AdSettings;
  let fixture: ComponentFixture<AdSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
