
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';
import { Card } from '../../../Z-Commons/card/card';
import { AlertService } from '../../../constants/alertservice';
import { GlobalConstant } from '../../../constants/global-constants';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { FilePreview } from "../../../Z-Commons/file-preview/file-preview";

@Component({
  selector: 'app-subscription-rewards-create-edit',
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    Card,
    // FilePreview
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
  editId: any;
  GlobalConstant: any = GlobalConstant;
  togglebtn: boolean = false;
  plansData: any;
  public btnLoader:boolean = false;


  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }
ngOnInit(): void {
  this.rewardsForm = this.fb.group({
    title: ['', Validators.required],
    image: [null],
    amount: [null],
    description: [null],
    Status: [null],
    subscription_id: [null],
    Index:[null],
    _id: [null],
  });
  this.acRouter.paramMap.subscribe((param) => {
    var id = String(param.get('id'));
    if(id && id != 'null'){
      this.getById(id);
    }
  });
  this.getPlanlist();
}


  get rewardsFormControl() {
    return this.rewardsForm.controls;
  }
  getById(id: any) {
  this.pageLoader = true;
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.rewards_getbyid + "/" + id;

  this.navService.getData(apiUrl).subscribe({
    next: (res: any) => {
      console.log("id", res);
      const item = res.data[0] || res.data;
      this.rewardsForm.patchValue({
        title: item.title,
        image: item.image,
        amount: item.amount,
        Index: item.Index,
        Status:item.Status,
        description: item.description,
        subscription_id: item.subscription_id,
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

getPlanlist(){
  const apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.subscription_getlist;
  
    this.plansData = [];
    this.navService.  getData(apiUrl).subscribe({
      next:(res:any)=> {
        console.log('plans',res);

        if (res.code === 200) {
          this.plansData = res.data;
           console.log('planslist',this.plansData);
        }
        else {
          this.alertService.toast("error",true,res.message);
        }
    
        this.cdr.detectChanges();
      },
      error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      }
    })


}
  submit() {
  if (this.rewardsForm.valid) {
    this.btnLoader = true;

    if (this.rewardsFormControl['_id'].value) {
      // ✅ UPDATE
      let apiUrl =
        ApiRoutesConstants.BASE_URL +
        ApiRoutesConstants.rewards_edit +
        "/" +
        this.rewardsFormControl['_id'].value;

      this.navService.updateData(apiUrl, this.rewardsForm.value).subscribe({
        next: (res: any) => {
          this.btnLoader = false;
          if (res.code === 200) {
            this.alertService.toast('success', true, res.message);
            this.router.navigate(['/admin/subs-rewards']);
          } else {
            this.alertService.toast('error', true, res.message);
          }
        },
        error: () => (this.btnLoader = false),
      });

    } else {
      // ✅ CREATE (THIS WAS MISSING)
      let apiUrl =
        ApiRoutesConstants.BASE_URL +
        ApiRoutesConstants.rewards_create;

      this.navService.postData(apiUrl, this.rewardsForm.value).subscribe({
        next: (res: any) => {
          this.btnLoader = false;
          if (res.code === 200) {
            this.alertService.toast('success', true, res.message);
            this.router.navigate(['/admin/subs-rewards']);
          } else {
            this.alertService.toast('error', true, res.message);
          }
        },
        error: () => (this.btnLoader = false),
      });
    }

  } else {
    this.rewardsForm.markAllAsTouched();
  }
}
  onFilePathReceived(filePath: string) {
    this.rewardsFormControl['image'].setValue(filePath);
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

    toggleLevelStop() {
    this.togglebtn = !this.togglebtn;
    console.log('Status:', this.rewardsForm.value.levelStop ? 'Active' : 'Inactive');
  }
}
