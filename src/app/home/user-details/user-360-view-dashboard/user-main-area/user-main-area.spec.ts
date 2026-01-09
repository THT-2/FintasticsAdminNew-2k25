import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMainArea } from './user-main-area';

describe('UserMainArea', () => {
  let component: UserMainArea;
  let fixture: ComponentFixture<UserMainArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMainArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMainArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
