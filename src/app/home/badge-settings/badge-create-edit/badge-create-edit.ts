import { Component } from '@angular/core';
import { Card } from "../../../Z-Commons/card/card";
import { FileUpload } from "../../../Z-Commons/file-upload/file-upload";
import { OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { AlertService } from '../../../constants/alertservice';
import { GlobalConstant } from '../../../constants/global-constants';
import { Data } from '../../../Service/data';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-badge-create-edit',
  imports: [Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload ,
    // FilePreview,
    NgIf],
  templateUrl: './badge-create-edit.html',
  styleUrl: './badge-create-edit.scss',
  providers: [AlertService],
})
export class BadgeCreateEdit implements OnInit{

  badgeForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  Badge: any;
  selectedimage: any;
  public btnLoader:boolean = false;
  statusOptions: string[] = ['Active', 'Inactive'];

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
  this.badgeForm = this.fb.group({
    title: ['', Validators.required],
    points: ['', Validators.required],
    icon: [null,Validators.required],
    status:['',Validators.required],
    _id: [null],
  });
}

  get badgeFormControl() {
    return this.badgeForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.badgelist_byId + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log("res",res);
        this.Badge = res.data;
        this.badgeForm.patchValue({
          title: this.Badge.title,
          points: this.Badge.points,
          status:this.Badge.status,
          icon: this.Badge.icon,
          _id: this.Badge._id,
        });
        this.editId = this.Badge._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.badgeForm.valid) {
      this.btnLoader = true;
      if (this.badgeFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.badgelist_edit + "/" + this.badgeFormControl['_id'].value;
        this.navService.postData(apiUrl, this.badgeForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/badge-settings']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.badgelist_create;
          delete this.badgeForm.value._id
        this.navService.postData(apiUrl, this.badgeForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/badge-settings']);
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
      this.badgeForm.markAllAsTouched();
    }
  }
  onFilePathReceived(icon: string) {
    this.badgeFormControl['icon'].setValue(icon);
  }

  removeImages(key:any) {
    if(key == "image") {
    this.badgeForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.badgeForm.patchValue({
      icon:''
    })
    }
  }
}
