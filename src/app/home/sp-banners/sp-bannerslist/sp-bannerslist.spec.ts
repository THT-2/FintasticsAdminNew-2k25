import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpBannerslist } from './sp-bannerslist';

describe('SpBannerslist', () => {
  let component: SpBannerslist;
  let fixture: ComponentFixture<SpBannerslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpBannerslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpBannerslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
