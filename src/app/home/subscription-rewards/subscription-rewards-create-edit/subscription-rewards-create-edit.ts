
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';
import { Card } from '../../../Z-Commons/card/card';
import { AlertService } from '../../../constants/alertservice';
import { GlobalConstant } from '../../../constants/global-constants';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-subscription-rewards-create-edit',
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    Card
],
  templateUrl: './subscription-rewards-create-edit.html',
  styleUrl: './subscription-rewards-create-edit.scss',
  providers: [AlertService],
})
export class  SubscriptionRewardsCreateEdit {
  rewardsForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  rewards: any;
  selectedimage: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  subscriptionTypes = ["Free","Basic","Standard","Premium","UltraPremium"];

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ) {

  }
ngOnInit(): void {
  this.rewardsForm = this.fb.group({
    title: ['', Validators.required],
    icon: [null],
    type: [null],
    offerAmount: [null],
    description: [null],
    _id: [null],
  });
  this.acRouter.paramMap.subscribe((param) => {
    var id = String(param.get('id'));
    if(id && id != 'null'){
      this.getById(id);
    }
  });
}


  get rewardsFormControl() {
    return this.rewardsForm.controls;
  }
  getById(id: any) {
  this.pageLoader = true;
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.features_getlist_ById + "/" + id;

  this.navService.getData(apiUrl).subscribe({
    next: (res: any) => {
      console.log("id", res);
      const item = res.data[0];
      this.rewardsForm.patchValue({
        title: item.title,
        icon: item.icon,
        type: item.type,
        offerAmount: item.offerAmount,
        description: item.description,
        _id: item._id,
      });

      this.editId = item._id;
      this.pageLoader = false;
    },
    error: (error: any) => {
      console.log(error);
      this.pageLoader = false;
    },
  });
}


  submit() {
    if (this.rewardsForm.valid) {
      this.btnLoader = true;
      if (this.rewardsFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.features_edit + "/" + this.rewardsFormControl['_id'].value;
        this.navService.postData(apiUrl, this.rewardsForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/subs-rewards']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.message);
              this.btnLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
      } else {
        let apiUrl =
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.features_create;
       
        this.navService.postData(apiUrl, this.rewardsForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/subs-rewards']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.message);
              this.btnLoader = false;
            }
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
      }
    } else {
      this.rewardsForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.rewardsFormControl['icon'].setValue(filePath);
  }

    fileuploadAnyProof(event: any,key:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedimage = event.target.files;
      const fd = new FormData();
        fd.append('sampleFile', this.selectedimage[0]);
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.uploadfile;
      this.navService.postData(apiUrl,fd).subscribe((res: any) => {

        if (key == "image") {
          this.rewardsForm.patchValue({
            image:res.Data
          })
        }else if(key == "icon"){
          this.rewardsForm.patchValue({
            icon:res.Data
          })
        }
      });

    } else {
      console.error("No files selected.");
    }
  }

  removeImages(key:any) {
    if(key == "image") {
    this.rewardsForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.rewardsForm.patchValue({
      icon:''
    })
    }
  }
}
