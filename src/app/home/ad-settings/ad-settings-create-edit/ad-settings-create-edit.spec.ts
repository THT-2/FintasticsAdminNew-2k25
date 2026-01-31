import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSettingsCreateEdit } from './ad-settings-create-edit';

describe('AdSettingsCreateEdit', () => {
  let component: AdSettingsCreateEdit;
  let fixture: ComponentFixture<AdSettingsCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdSettingsCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSettingsCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
