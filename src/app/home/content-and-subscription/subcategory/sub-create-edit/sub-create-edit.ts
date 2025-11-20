import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
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
  selector: 'app-sub-create-edit',
  imports: [
    Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FileUpload,
    FilePreview
],
  templateUrl: './sub-create-edit.html',
  styleUrl: './sub-create-edit.scss',
  providers: [AlertService]
})
export class SubCreateEdit implements OnInit{


  subCategoryForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  subCategoryData: any;
  categoryData:any[] = []
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  success_msg_data: any[]= [];

  categoryTypes: any[] = ["Income", "Expense","Others"];
  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      if(id != 'null'){
        this.getById(id);
      }
    });
  }
ngOnInit(): void {
  this.subCategoryForm = this.fb.group({
    // categoryType: [null, Validators.required],
    desc_type_id: [null, Validators.required],
    // desc_type: ['', Validators.required],
    sub_desc_type: ["", Validators.required],
    icon: [null, Validators.required],
    colorCode:[""],
    tax_msg: [null],
    success_msg:[null],
    _id: [null],
  });

}

  get subCategoryFormControl() {
    return this.subCategoryForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SUB_DESC_TYPE + ApiRoutesConstants.GET_LIST_ID + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.subCategoryData = res.Data||[];
        console.log("subcatdata",this.subCategoryData);

        this.subCategoryForm.patchValue({
          categoryType: this.subCategoryData.categoryType,
          desc_type_id: this.subCategoryData.desc_type_id,
          desc_type:this.subCategoryData.desc_type,
          sub_desc_type: this.subCategoryData.sub_desc_type,
          tax_msg: this.subCategoryData.tax_msg,
          icon: this.subCategoryData.icon,
          colorCode:this.subCategoryData.colorCode,
          _id: this.subCategoryData._id,
        });

        this.getCategoryDataForEdit(this.subCategoryData.categoryType, this.subCategoryData.desc_type_id);
        this.success_msg_data= this.subCategoryData.success_msg || [];
        this.editId = this.subCategoryData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }


private getCategoryDataForEdit(categoryType: string, descTypeIdToSelect?: string) {
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.desc_type_getlist;
  this.navService.postData(apiUrl, { categoryType }).subscribe({
    next: (res: any) => {
      if (res.Code === 200) {
        this.categoryData = res.Data || [];
        console.log("catname",this.categoryData);

        if (descTypeIdToSelect) {
          this.subCategoryForm.get('desc_type_id')?.setValue(descTypeIdToSelect);
        }
        this.cd.detectChanges();
      } else {
        this.alertService.toast("error", true, res.Message);
      }
    },
    error: (error: any) => this.alertService.toast("error", true, error)
  });
}
  submit() {
    console.log("subvalid",this.subCategoryForm);

    if (this.subCategoryForm.valid) {
      this.btnLoader = true;

      if (this.subCategoryFormControl['_id'].value) {
        let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SUB_DESC_TYPE + ApiRoutesConstants.EDIT + "/" +  this.subCategoryFormControl['_id'].value;
        let data = {
          ...this.subCategoryForm.value,
          success_msg:this.success_msg_data
        }
        this.navService.postData(apiUrl, data).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/subcategory']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SUB_DESC_TYPE + ApiRoutesConstants.CREATE;
          delete this.subCategoryForm.value._id
        this.navService.postData(apiUrl, this.subCategoryForm.value).subscribe({
          next: (res: any) => {
            console.log("create",res);

            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/subcategory']);
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
      this.subCategoryForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.subCategoryFormControl['icon'].setValue(filePath);
  }

  getCategoryData(){
    this.subCategoryForm.value.categoryType
    let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.desc_type_getlist;
    this.navService.postData(apiUrl,{categoryType: this.subCategoryForm.value.categoryType}).subscribe({
      next:(res:any)=> {
        console.log(res);

        if (res.Code === 200){
          this.categoryData = res.Data;
        }else {
          this.alertService.toast("error",true,res.Message);
        }
      },error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      },
      complete: () => {
      }
    })
  }

  addsuccess_msg() {
    const msg = this.subCategoryForm.value.success_msg?.trim();
    console.log("success_msg", msg);
    if (msg) {
      this.success_msg_data.push(msg);
    }
    this.subCategoryForm.get('success_msg')?.reset();
  }

  removesuccess_msg(index: number): void {
      if (index > -1 && index < this.success_msg_data.length) {
        this.success_msg_data.splice(index, 1);
      }
  }
}


