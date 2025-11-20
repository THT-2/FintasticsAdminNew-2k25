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
  selector: 'app-subs-features-create-edit',
  imports: [
    Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    // FilePreview,
    NgIf,
  ],
  templateUrl: './subs-features-create-edit.html',
  styleUrl: './subs-features-create-edit.scss',
  providers: [AlertService],
})
export class SubsFeaturesCreateEdit {
  FeaturesForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  features: any;
  selectedimage: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ) {

  }
ngOnInit(): void {
  this.FeaturesForm = this.fb.group({
    title: ['', Validators.required],
    icon: [null],
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


  get FeaturesFormControl() {
    return this.FeaturesForm.controls;
  }
  getById(id: any) {
  this.pageLoader = true;
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.features_getlist_ById + "/" + id;

  this.navService.getData(apiUrl).subscribe({
    next: (res: any) => {
      console.log("id", res);
      const item = res.data[0];
      this.FeaturesForm.patchValue({
        title: item.title,
        icon: item.icon,
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
    if (this.FeaturesForm.valid) {
      this.btnLoader = true;
      if (this.FeaturesFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.features_edit + "/" + this.FeaturesFormControl['_id'].value;
        this.navService.postData(apiUrl, this.FeaturesForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/features']);
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
          delete this.FeaturesForm.value._id
        this.navService.postData(apiUrl, this.FeaturesForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/features']);
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
      this.FeaturesForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.FeaturesFormControl['icon'].setValue(filePath);
  }

    fileuploadAnyProof(event: any,key:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedimage = event.target.files;
      const fd = new FormData();
        fd.append('sampleFile', this.selectedimage[0]);
        let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.uploadfile;
      this.navService.postData(apiUrl,fd).subscribe((res: any) => {

        if (key == "image") {
          this.FeaturesForm.patchValue({
            image:res.Data
          })
        }else if(key == "icon"){
          this.FeaturesForm.patchValue({
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
    this.FeaturesForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.FeaturesForm.patchValue({
      icon:''
    })
    }
  }
}
