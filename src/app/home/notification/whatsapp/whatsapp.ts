import { ChangeDetectorRef, Component } from '@angular/core';
import { Card } from "../../../Z-Commons/card/card";
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../constants/alertservice';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-whatsapp',
  imports: [Card,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.scss',
  providers:[AlertService]
})
export class Whatsapp {

  pushNotficationForm: FormGroup;
  selectedimage: any;
  constructor(private fb:FormBuilder ,private navService:Data ,private alertService:AlertService,
    private cdr: ChangeDetectorRef,private router:Router
  ){
    this.pushNotficationForm = this.fb.group({
      // title: ['', Validators.required],
      body: ['', Validators.required],
      // image: ['']
    });
  }


  submit(){
    if (this.pushNotficationForm.valid) {
      let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.wtsappNotfication;
      this.navService.postData(apiUrl,this.pushNotficationForm.value).subscribe({
        next:(res:any)=> {
          if (res.Code === 200) {
            this.alertService.toast("success",true,res.Message);
            this.pushNotficationForm.reset();
          }else {
            this.alertService.toast("error",true,res.Message);
          }
          // this.loader=false;
        this.cdr.detectChanges();
        },
        error: (error:any) => {
          console.log(error);

        }
      })
    } else {
      this.pushNotficationForm.markAllAsTouched();
    }

  }



  fileuploadAnyProof(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedimage = event.target.files;
      const fd = new FormData();
        fd.append('sampleFile', this.selectedimage[0]);
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.uploadfile;
      this.navService.postData(apiUrl,fd).subscribe((res: any) => {

        // this.pushNotficationForm.patchValue({
        //   image:res.Data
        // });

      });

    } else {
      console.error("No files selected.");
    }
  }

  removeImages() {
    if(this.pushNotficationForm.value.image) {
    this.pushNotficationForm.patchValue({
      image:''
    }) }
  }
}
