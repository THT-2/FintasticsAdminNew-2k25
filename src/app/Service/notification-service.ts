import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return Promise.resolve('denied');
    }

    if (Notification.permission === 'granted') {
      return Promise.resolve('granted');
    }

    return Notification.requestPermission();
  }

  showNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
        }
      });
    }
  }
}
