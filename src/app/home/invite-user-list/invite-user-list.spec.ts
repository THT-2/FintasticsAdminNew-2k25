import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUserList } from './invite-user-list';

describe('InviteUserList', () => {
  let component: InviteUserList;
  let fixture: ComponentFixture<InviteUserList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteUserList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteUserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
