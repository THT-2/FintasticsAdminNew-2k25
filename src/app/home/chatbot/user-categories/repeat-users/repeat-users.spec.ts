import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatUsers } from './repeat-users';

describe('RepeatUsers', () => {
  let component: RepeatUsers;
  let fixture: ComponentFixture<RepeatUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepeatUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
