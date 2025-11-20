import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenifitsBannerCreateEdit } from './benifits-banner-create-edit';

describe('BenifitsBannerCreateEdit', () => {
  let component: BenifitsBannerCreateEdit;
  let fixture: ComponentFixture<BenifitsBannerCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenifitsBannerCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenifitsBannerCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
