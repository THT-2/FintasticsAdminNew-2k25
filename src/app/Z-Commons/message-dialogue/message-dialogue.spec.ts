import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDialogue } from './message-dialogue';

describe('MessageDialogue', () => {
  let component: MessageDialogue;
  let fixture: ComponentFixture<MessageDialogue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDialogue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageDialogue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
