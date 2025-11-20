import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRight } from './chat-right';

describe('ChatRight', () => {
  let component: ChatRight;
  let fixture: ComponentFixture<ChatRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatRight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
