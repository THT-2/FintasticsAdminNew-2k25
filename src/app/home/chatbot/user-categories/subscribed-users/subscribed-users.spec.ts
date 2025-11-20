import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedUsers } from './subscribed-users';

describe('SubscribedUsers', () => {
  let component: SubscribedUsers;
  let fixture: ComponentFixture<SubscribedUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribedUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
