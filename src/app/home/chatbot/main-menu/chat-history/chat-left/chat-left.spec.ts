import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLeft } from './chat-left';

describe('ChatLeft', () => {
  let component: ChatLeft;
  let fixture: ComponentFixture<ChatLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatLeft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatLeft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
