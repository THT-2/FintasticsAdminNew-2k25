
import { CanDeactivateFn } from '@angular/router';

export interface ChatCanDeactivate {

  canLeaveChat: () => boolean;
  confirmLeaveChat: () => Promise<boolean>;
}


export const chatBlockGuard: CanDeactivateFn<ChatCanDeactivate> =
  (component, currentRoute, currentState, nextState) => {

    if (component.canLeaveChat()) {
      return true;
    }

    // const confirmed = window.confirm(
    //   'You have an active chat. Are you sure you want to leave this page?'
    // );

    // return confirmed;
    return component.confirmLeaveChat();
  };
