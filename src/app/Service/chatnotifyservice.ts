import { Injectable } from '@angular/core';
import { Socketservice } from '../Service/socketservice';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root'
})
export class ChatNotifyService {
  private initialized = false;

  constructor(
    private notificationService: NotificationService
  ) {}

  init(token: string, userId: string) {
    // Avoid initializing twice
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    console.log('[ChatNotificationService] init with userId:', userId);

    Socketservice.instance.initSocket({
      token,
      userId,
      joinroom: `finexpertchat:user:${userId}`,
      eventName: 'chat:adminget',
      onData: (data) => {
        console.log('[ChatNotificationService] Socket data received:', data);

        const msgs = Array.isArray(data.msg) ? data.msg : [];
        const newCount = msgs.length;

        if (newCount === 0) return;

        const lastMessage = msgs[newCount - 1];

        const isFromUser =
          lastMessage.sender === 'user' ||
          lastMessage.senderRole === 'user';

        console.log(
          '[ChatNotificationService] lastMessage:',
          lastMessage,
          'isFromUser =',
          isFromUser
        );


        if (!isFromUser) return;

        // Compute a nice title (user name)
        const userName =
          data?.name?.username ||
          data?.name ||
          lastMessage.userName ||
          'New message';

        this.notificationService.showNotification(userName, {
          body: lastMessage.text || 'New message',
          icon: 'assets/favicon.ico'
        });
      }
    });
  }
}
