import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyUserList } from './family-user-list';

describe('FamilyUserList', () => {
  let component: FamilyUserList;
  let fixture: ComponentFixture<FamilyUserList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyUserList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyUserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
