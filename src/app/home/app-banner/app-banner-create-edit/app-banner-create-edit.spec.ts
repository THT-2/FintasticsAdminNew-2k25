import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBannerCreateEdit } from './app-banner-create-edit';

describe('AppBannerCreateEdit', () => {
  let component: AppBannerCreateEdit;
  let fixture: ComponentFixture<AppBannerCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBannerCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppBannerCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
