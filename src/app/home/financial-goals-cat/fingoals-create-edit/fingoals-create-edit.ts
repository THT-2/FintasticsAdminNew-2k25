import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '../../../Service/data';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-fingoals-create-edit',
    imports: [Card,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    // FilePreview
  ],
  templateUrl: './fingoals-create-edit.html',
  styleUrl: './fingoals-create-edit.scss',
  providers: [AlertService],
})
export class FingoalsCreateEdit implements OnInit {

  public btnLoader:boolean = false;
  categoryForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  selectedimage: any;
  categoryData: any;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  sidebarAccess: any;
  item: any;

  constructor(
    private fb: FormBuilder,
    private navService: Data ,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
    ) {
        this.acRouter.paramMap.subscribe((param) => {
          var id = String(param.get('id'));
          if(id!="null"){
            this.getById(id);
          }
        });
      }

  ngOnInit(): void {
  this.categoryForm = this.fb.group({
    catagory_type: ['', Validators.required],
    icon: [null, Validators.required],
    _id: [null],

  });
}

  getById(id: string) {
        this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financial_goals_getlist_byid+ "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.categoryData = res.data;
        this.categoryForm.patchValue({
          catagory_type: this.categoryData.catagory_type,
          icon: this.categoryData.icon,
          _id: this.categoryData._id,
        });
        this.editId = this.categoryData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  get categoryFormControl() {
    return this.categoryForm.controls;
  }

    submit() {
    if (this.categoryForm.valid) {
      this.btnLoader = true;
      if (this.categoryFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financial_goals_edit + "/" +  this.categoryFormControl['_id'].value;
        this.navService.updateData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/goals']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financial_goals_create;
          delete this.categoryForm.value._id
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/goals']);
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
      this.categoryForm.markAllAsTouched();
    }
  }

  onFilePathReceived(filePath: string) {
    this.categoryFormControl['icon'].setValue(filePath);
  }


  removeImages(key:any) {
    if(key == "image") {
    this.categoryForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.categoryForm.patchValue({
      icon:''
    })
    }
  }

}
