import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAndRecommendations } from './users-and-recommendations';

describe('UsersAndRecommendations', () => {
  let component: UsersAndRecommendations;
  let fixture: ComponentFixture<UsersAndRecommendations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersAndRecommendations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersAndRecommendations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
