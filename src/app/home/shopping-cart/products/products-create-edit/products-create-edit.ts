import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FileUpload } from '../../../../Z-Commons/file-upload/file-upload';
import { FilePreview } from '../../../../Z-Commons/file-preview/file-preview';
import { Card } from '../../../../Z-Commons/card/card';
import { AlertService } from '../../../../constants/alertservice';
import { GlobalConstant } from '../../../../constants/global-constants';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { Data } from '../../../../Service/data';

@Component({
  selector: 'app-products-create-edit',
    imports: [Card ,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FileUpload,
    FilePreview
  ],
  templateUrl: './products-create-edit.html',
  styleUrl: './products-create-edit.scss',
  providers: [AlertService]
})
export class ProductsCreateEdit {

  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  ProductData: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  public apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.shoppingcartCategorygetlist;
  public loader: boolean = true;
  tableData!: any[];
  ProductsForm: any;

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
  this.getCategoryData();
  this.ProductsForm = this.fb.group({
    productName: ['', Validators.required],
    shoppingcatid: ['', Validators.required],
    price: ['', Validators.required],
    offerPrice: [''],
    rewardOfferPoints: ['', Validators.required],
    stockQuantity: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: ['', Validators.required],
    isAvailable:[true, Validators.required],
    _id: [null],
  });
}

  get ProductsFormControl() {
    return this.ProductsForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.shoppingcartproductsgetlist_id + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log(res);
        this.ProductData = res.Data;
        this.ProductsForm.patchValue({
          productName: this.ProductData.productName,
          shoppingcatid: this.ProductData.shoppingcatid,
          price: this.ProductData.price,
          offerPrice: this.ProductData.offerPrice,
          rewardOfferPoints: this.ProductData.rewardOfferPoints,
          stockQuantity: this.ProductData.stockQuantity,
          description: this.ProductData.description,
          imageUrl: this.ProductData.imageUrl,
          isAvailable: this.ProductData.isAvailable,
          _id: this.ProductData._id,
        });
        this.editId = this.ProductData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }


  getCategoryData(){
    this.loader = true;
    this.tableData = [];
    this.navService.getData(this.apiUrl).subscribe({
      next:(res:any)=> {
        console.log(res);
        if (res.Code === 200){
          this.tableData = res.Data;
          console.log("this.tableData ",this.tableData);

        }else {
          this.alertService.toast("error",true,res.Message);
        }
      },error: (error:any) => {
        console.log(error);
        this.alertService.toast("error",true,error);
      },
      complete: () => {
        this.loader = false;
      }
    })
  }

  submit() {
    console.log("this.ProductsForm",this.ProductsForm);

    if (this.ProductsForm.valid) {
      this.btnLoader = true;
      if (this.ProductsFormControl['_id'].value) {
        let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.shoppingcartproducts + ApiRoutesConstants.EDIT + "/" +  this.ProductsFormControl['_id'].value;
        this.navService.postData(apiUrl, this.ProductsForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/shoppingcart-products']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.shoppingcartproducts + ApiRoutesConstants.CREATE;
          delete this.ProductsForm.value._id
        this.navService.postData(apiUrl, this.ProductsForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/shoppingcart-products']);
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
      this.ProductsForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.ProductsFormControl['imageUrl'].setValue(filePath);
  }
}
