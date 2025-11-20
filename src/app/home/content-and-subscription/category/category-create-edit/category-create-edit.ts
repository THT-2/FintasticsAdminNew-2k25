import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {ActivatedRoute,Router,} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Data } from '../../../../Service/data';
import { AlertService } from '../../../../constants/alertservice';
import { GlobalConstant } from '../../../../constants/global-constants';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { FileUpload } from "../../../../Z-Commons/file-upload/file-upload";
import { FilePreview } from "../../../../Z-Commons/file-preview/file-preview";
import { Card } from "../../../../Z-Commons/card/card";
@Component({
  selector: 'app-category-create-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    FilePreview,
    Card,
    NgIf
],
  templateUrl: './category-create-edit.html',
  styleUrl: './category-create-edit.scss',
  providers: [AlertService],
})
export class CategoryCreateEdit implements OnInit{

  categoryForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  categoryData: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  categoryTypes: any[] = ["Income", "Expense","Others"];
  constructor(
    private fb: FormBuilder,
    private navService: Data,
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
    desc_type: ['', Validators.required],
    icon: [null, Validators.required],
    backgroundimage: [null, Validators.required],
    colorCode:[""],
    budgetpercentage:[""],
    categoryType: ["",Validators.required],
    _id: [null],
  });
}

  get categoryFormControl() {
    return this.categoryForm.controls;
  }
  
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.GET_LIST_ID + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.categoryData = res.Data;
        this.categoryForm.patchValue({
          desc_type: this.categoryData.desc_type,
          icon: this.categoryData.icon,
          backgroundimage: this.categoryData.backgroundimage,
          colorCode:this.categoryData.colorCode,
          budgetpercentage:this.categoryData.budgetpercentage,
          categoryType: this.categoryData.categoryType,
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
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.EDIT + "/" +  this.categoryFormControl['_id'].value;
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/category']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.DESC_TYPE + ApiRoutesConstants.CREATE;
          delete this.categoryForm.value._id
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/category']);
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

  onBgFilePathReceived(filePath: string) {
    this.categoryFormControl['backgroundimage'].setValue(filePath);
  }
}
