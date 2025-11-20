import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTrends } from './chat-trends';

describe('ChatTrends', () => {
  let component: ChatTrends;
  let fixture: ComponentFixture<ChatTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTrends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTrends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
