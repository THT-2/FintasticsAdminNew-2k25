import { TestBed } from '@angular/core/testing';
import { ChatNotifyService } from './chatnotifyservice';



describe('Chatservice', () => {
  let service: ChatNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
