import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';


@Component({
  selector: 'app-hometronics-create-edit',
  imports: [
    Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload ,
    // FilePreview  ,
    NgIf
  ],
  templateUrl: './hometronics-create-edit.html',
  styleUrl: './hometronics-create-edit.scss',
  providers: [AlertService],
})
export class HometronicsCreateEdit implements OnInit{

  categoryForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  categoryData: any;
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
  this.categoryForm = this.fb.group({
    catagory_type: ['', Validators.required],
    icon: [null, Validators.required],
    _id: [null],
  });
}

  get categoryFormControl() {
    return this.categoryForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.HOME_TONICS + ApiRoutesConstants.GET_LIST_ID + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.categoryData = res.Data;
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

  submit() {
    if (this.categoryForm.valid) {
      this.btnLoader = true;
      if (this.categoryFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.HOME_TONICS + ApiRoutesConstants.EDIT + "/" +  this.categoryFormControl['_id'].value;
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/hometronics']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.Message);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.HOME_TONICS + ApiRoutesConstants.CREATE;
          delete this.categoryForm.value._id
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/hometronics']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.Message);
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
