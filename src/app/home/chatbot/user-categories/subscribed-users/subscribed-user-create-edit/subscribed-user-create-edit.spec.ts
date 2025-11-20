import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedUserCreateEdit } from './subscribed-user-create-edit';

describe('SubscribedUserCreateEdit', () => {
  let component: SubscribedUserCreateEdit;
  let fixture: ComponentFixture<SubscribedUserCreateEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribedUserCreateEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedUserCreateEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
