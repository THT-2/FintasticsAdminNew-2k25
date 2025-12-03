import { Component, effect } from '@angular/core';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { AlertService } from '../../../../constants/alertservice';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-cards',
  templateUrl: './user-cards.html',
  styleUrl: './user-cards.scss',
  providers:[AlertService]
})
export class UserCards {

  participants: any;

  constructor(
    private navservice: Data,
    private cd: ChangeDetectorRef,
    private alertService: AlertService
  ) {

  
    effect(() => {
      const id = this.navservice.selectedUserId();
      if (id) {
        this.getParticipantsData(id);
      }
    });
  }

  getParticipantsData(id: string){
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.participantdata + "/" + id;

    this.navservice.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log("part",res);
        if (res.code === 200) {
          this.participants = res.result;
          console.log('partydata', this.participants);
        } else {
          this.alertService.toast("error", true, res.message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        this.alertService.toast("error", true, error);
      }
    });
  }
}
