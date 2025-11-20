import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AlertService } from '../../../../constants/alertservice';
import { Card } from '../../../../Z-Commons/card/card';
import { GlobalConstant } from '../../../../constants/global-constants';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { FilePreview } from "../../../../Z-Commons/file-preview/file-preview";
import { FileUpload } from "../../../../Z-Commons/file-upload/file-upload";

@Component({
  selector: 'app-cart-create-edit',
    imports: [Card,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule, FilePreview, FileUpload],
  templateUrl: './cart-create-edit.html',
  styleUrl: './cart-create-edit.scss',
  providers:[AlertService]
})
export class CartCreateEdit {

  categoryForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  categoryData: any;
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
    shoppingcatname: ['', Validators.required],
    _id: [null],
  });
}

  get categoryFormControl() {
    return this.categoryForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.shoppingcartCategorygetlist_id + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.categoryData = res.Data;
        this.categoryForm.patchValue({
          shoppingcatname: this.categoryData.shoppingcatname,
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
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.shoppingcartCategory + ApiRoutesConstants.EDIT + "/" +  this.categoryFormControl['_id'].value;
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/shoppingcart-category']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.shoppingcartCategory + ApiRoutesConstants.CREATE;
          delete this.categoryForm.value._id
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/shoppingcart-category']);
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
}

