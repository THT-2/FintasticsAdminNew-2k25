import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../Z-Commons/card/card';
import { AlertService } from '../../../../constants/alertservice';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';

@Component({
  selector: 'app-push-create-edit',
  imports: [Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './push-create-edit.html',
  styleUrl: './push-create-edit.scss',
  providers:[AlertService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PushCreateEdit {

  pushNotficationForm!: FormGroup;
  selectedimage: any;
  user_typeData = ["All", "Subscription" ,"UnSubscription","Custom"];
  Notificationtype = ["Normal","Daily", "Weekly" ,"Monthly","Yearly","Custom"];
  weekDays = [
    { key: "Sunday", value: "Sun" },
    { key: "Monday", value: "Mon" },
    { key: "Tuesday", value: "Tue" },
    { key: "Wednesday", value: "Wed" },
    { key: "Thursday", value: "Thu" },
    { key: "Friday", value: "Fri" },
    { key: "Saturday", value: "Sat" }
  ];
  selected= []
  pushNotficationData: any;
  pageLoader: boolean = false;
  btnLoader: boolean = false;
  constructor(private fb:FormBuilder ,private navService:Data  ,private router: Router,
      private alertService: AlertService,
      private acRouter: ActivatedRoute,
      private cd: ChangeDetectorRef
    ){
    this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      if(id != 'null'){
        this.getById(id);
      }
    });
       this.pushNotficationForm = this.fb.group({
      title: [''],
      body: [''],
      image: [''],
      icon:[''],
      user_type:['',Validators.required],
      type:['',Validators.required],
      startDate:[''],
      endDate:[''],
      userlist:[null],
      time:['', Validators.required],
      date:[''],
      weekdays:[[]],
      _id:[null]
    });
  }

  ngOnInit(){
    this.handleTypeBasedValidation();
  }


 handleTypeBasedValidation() {
    this.pushNotficationForm.get('type')?.valueChanges.subscribe(type => {
      const dateCtrl = this.pushNotficationForm.get('date');
      const startDateCtrl = this.pushNotficationForm.get('startDate');
      const endDateCtrl = this.pushNotficationForm.get('endDate');
      const weekdaysCtrl = this.pushNotficationForm.get('weekdays');

      dateCtrl?.clearValidators();
      startDateCtrl?.clearValidators();
      endDateCtrl?.clearValidators();
      weekdaysCtrl?.clearValidators();

      if (type === 'Custom') {
        startDateCtrl?.setValidators([Validators.required]);
        endDateCtrl?.setValidators([Validators.required]);
      } else if (type === 'Weekly') {
        weekdaysCtrl?.setValidators([Validators.required]);
      } else {
        dateCtrl?.setValidators([Validators.required]);
      }

      dateCtrl?.updateValueAndValidity();
      startDateCtrl?.updateValueAndValidity();
      endDateCtrl?.updateValueAndValidity();
      weekdaysCtrl?.updateValueAndValidity();
    });
  }



  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.pushNotficationgetlist_id + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.pushNotficationData = res.Data;
        this.pushNotficationForm.patchValue({
          title: this.pushNotficationData.title,
          body: this.pushNotficationData.body,
          image: this.pushNotficationData.image,
          icon:this.pushNotficationData.icon,
          user_type:this.pushNotficationData.user_type,
          type:this.pushNotficationData.type,
          startDate:this.pushNotficationData.startDate,
          endDate:this.pushNotficationData.endDate,
          userlist:this.pushNotficationData.userlist,
          time:this.pushNotficationData.time,
          date:this.pushNotficationData.date,
          weekdays:this.pushNotficationData.weekdays,
          _id: this.pushNotficationData._id,
        });
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

submit() {
  console.log("this.pushNotficationForm",this.pushNotficationForm);

    if (this.pushNotficationForm.invalid) {
      this.pushNotficationForm.markAllAsTouched();
      return;
    }

    this.btnLoader = true;
    const formData = this.pushNotficationForm.value;

    let apiUrl = '';
    if (formData._id) {
      apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.pushNotficationedit}/${formData._id}`;
    } else {
      apiUrl = `${ApiRoutesConstants.BASE_URL}${ApiRoutesConstants.pushNotficationcreate}`;
    }

    this.navService.postData(apiUrl, formData).subscribe({
      next: (res: any) => {
        this.btnLoader = false;
        if (res.Code === 200) {
          this.alertService.toast('success', true, res.Message);
          this.pushNotficationForm.reset();
          this.router.navigate(['/admin/push']);
        } else {
          this.alertService.toast('error', true, res.Message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.alertService.toast('error', true, 'Something went wrong!');
        this.btnLoader = false;
      }
    });
  }

  fileuploadAnyProof(event: any,key:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedimage = event.target.files;
      const fd = new FormData();
        fd.append('sampleFile', this.selectedimage[0]);
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.uploadfile;
      this.navService.postData(apiUrl,fd).subscribe((res: any) => {

        if (key == "image") {
          this.pushNotficationForm.patchValue({
            image:res.Data
          })
          this.cd.detectChanges();
        }else if(key == "icon"){
          this.pushNotficationForm.patchValue({
            icon:res.Data
          })
          this.cd.detectChanges();
        }
      });

    } else {
      console.error("No files selected.");
    }
    this.cd.detectChanges();
  }
  removeImages(key:any) {
    if(key == "image") {
    this.pushNotficationForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.pushNotficationForm.patchValue({
      icon:''
    })
    }
  }

}
