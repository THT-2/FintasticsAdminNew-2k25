import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUsers } from './top-users';

describe('TopUsers', () => {
  let component: TopUsers;
  let fixture: ComponentFixture<TopUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
