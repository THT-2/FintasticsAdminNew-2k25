import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';

@Component({
  selector: 'app-ad-settings-create-edit',
  imports: [  Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // FilePreview  ,
    NgIf],
  templateUrl: './ad-settings-create-edit.html',
  styleUrl: './ad-settings-create-edit.scss',
  providers: [AlertService],
})
export class AdSettingsCreateEdit implements OnInit{

  adForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  adsData: any;
  public btnLoader:boolean = false;
  editId: any;
  adname: any[] = ['native_ad','banner_ad','interstitial_ad','rewarded_ad'];
  GlobalConstant: any = GlobalConstant;
  togglebtn: boolean = false;

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
  this.adForm = this.fb.group({
    google_ad_maincate:['',Validators.required],
    android_ad:['',Validators.required],
    ios_ad:['',Validators.required],
    android_active_status:[false],
    ios_active_status:[false],
    _id: [null],
  });
}

  get adFormControl() {
    return this.adForm.controls;
  }
  
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.adlist_getbyid+ "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.adsData = res.data;
        this.adForm.patchValue({
          google_ad_maincate: this.adsData.google_ad_maincate,
          android_ad: this.adsData.android_ad,
          ios_ad: this.adsData.ios_ad,
          android_active_status: this.adsData.android_active_status,
          ios_active_status: this.adsData.ios_active_status,
          _id: this.adsData._id,
        });
        this.editId = this.adsData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.adForm.valid) {
      this.btnLoader = true;
      if (this.adFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.adlist_edit+ "/" +  this.adFormControl['_id'].value;
        this.navService.postData(apiUrl, this.adForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/ad-settings']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.adcreate;
          delete this.adForm.value._id
        this.navService.postData(apiUrl, this.adForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/ad-settings']);
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
      this.adForm.markAllAsTouched();
    }
  }


    toggleLevelStop() {
    this.togglebtn = !this.togglebtn;
    console.log('Level Stop:', this.adForm.value.levelStop ? 'ON' : 'OFF');
  }

}
