import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Card } from '../../../Z-Commons/card/card';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';
import { AlertService } from '../../../constants/alertservice';
import { GlobalConstant } from '../../../constants/global-constants';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-app-banner-create-edit',
   imports: [
    Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload ,
    // FilePreview  ,
    NgIf
  ],
  templateUrl: './app-banner-create-edit.html',
  styleUrl: './app-banner-create-edit.scss',
  providers: [AlertService],
})
export class AppBannerCreateEdit implements OnInit{

  bannerForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  BannerData: any;
  selectedimage: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(
    private fb: FormBuilder,
    private navService: Data ,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ) {

    this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      if(id != 'null'){
        this.getById(id);
      }
    });
  }
ngOnInit(): void {
  this.bannerForm = this.fb.group({
    title: ['', Validators.required],
    description: [null],
    page_name: [null, Validators.required],
    filepath: [null, Validators.required],
    _id: [null],
  });
}

  get bannerFormControl() {
    return this.bannerForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Banners_getbyId + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log("rea",res);
        this.BannerData = res.data;
        this.bannerForm.patchValue({
          title: this.BannerData.title,
          description: this.BannerData.description,
          page_name: this.BannerData.page_name,
          filepath: this.BannerData.filepath,
          _id: this.BannerData._id,
        });
        this.editId = this.BannerData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.bannerForm.valid) {
      this.btnLoader = true;
      if (this.bannerFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Banners_edit + "/" + this.bannerFormControl['_id'].value;
        this.navService.postData(apiUrl, this.bannerForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/banners']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Banners_create;
          delete this.bannerForm.value._id
        this.navService.postData(apiUrl, this.bannerForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/banners']);
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
      this.bannerForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.bannerFormControl['filepath'].setValue(filePath);
  }

  removeImages(key:any) {
    if(key == "image") {
    this.bannerForm.patchValue({
      image:''
    })
  }else if (key == "filepath") {
    this.bannerForm.patchValue({
      filepath:''
    })
    }
  }
}
