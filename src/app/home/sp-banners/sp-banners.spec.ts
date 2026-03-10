import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpBanners } from './sp-banners';

describe('SpBanners', () => {
  let component: SpBanners;
  let fixture: ComponentFixture<SpBanners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpBanners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpBanners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
