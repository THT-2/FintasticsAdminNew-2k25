import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from '../../../../Z-Commons/file-upload/file-upload';
import { Card } from '../../../../Z-Commons/card/card';
import { FilePreview } from '../../../../Z-Commons/file-preview/file-preview';
import { AlertService } from '../../../../constants/alertservice';
import { GlobalConstant } from '../../../../constants/global-constants';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-list-create-edit',
  imports: [
      Card ,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      FileUpload,
      FilePreview,
      NgIf,
      NgxEditorModule
    ],
  templateUrl: './list-create-edit.html',
  styleUrl: './list-create-edit.scss',
  providers: [AlertService],
})
export class ListCreateEdit {

toolsForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  suitesData: any;
  public btnLoader:boolean = false;
  editId: any;
  selectedimage: any;
  GlobalConstant: any = GlobalConstant;
  editordoc = "";

  editor!: Editor;
  categoryData:any[] = ["Normal", "Special Offer"]
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  html = '';
  Data: any;
  apiUrl: any;
  constructor(
    private fb: FormBuilder,
    private dataService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ) {

  }
ngOnInit(): void {
  this.toolsForm = this.fb.group({
    toolName: ["", Validators.required],
    imageUrl: ["", Validators.required],
    content :["" , Validators.required],
    price:[null , Validators.required],
    offerPrice:[null,Validators.required],
    overView:["",Validators.required],
    tools:["", Validators.required],
    priceimageUrl:[null,Validators.required],
    blogs:[""],
    type:["",Validators.required],
    offerId:[""],
    _id: [null],
  });
  this.editor = new Editor();
  this.getTableData();
  this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      if(id != 'null'){
        this.getById(id);
      }
    });
}

// make sure to destory the editor
ngOnDestroy(): void {
  this.editor.destroy();
}

  get toolsFormControl() {
    return this.toolsForm.controls;
  }

  getTableData(){
    this.apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.subscription_getlist;
        this.dataService.getData(this.apiUrl).subscribe({
          next:(res:any)=> {
            console.log(res);

            if (res.Code === 200){
              this.Data = res.Data;

              console.log(this.Data);

            }else {
              this.alertService.toast("error",true,res.Message);
            }
          },
          error: (error:any) => {
            console.log(error);
            this.alertService.toast("error",true,error);
          },

        })
      }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.ToolsSuites_getlist_id ;
    this.dataService.postData(apiUrl,{_id:id}).subscribe({
      next: (res: any) => {
  console.log("Full response:", res);
  this.suitesData = res.Data;
  console.log("Suites Data:", this.suitesData);

  if (this.toolsForm && this.suitesData) {
    this.toolsForm.patchValue({
      toolName: this.suitesData.toolName || '',
      imageUrl: this.suitesData.imageUrl || '',
      content: this.suitesData.content || '',
      price: this.suitesData.price || '',
      offerPrice: this.suitesData.offerPrice || '',
      overView: this.suitesData.overView || '',
      tools: this.suitesData.tools || '',
      priceimageUrl: this.suitesData.priceimageUrl || '',
      type: this.suitesData.type || '',
      offerId: this.suitesData.offerId || '',
      _id: this.suitesData._id || ''
    });
  }

  this.editId = this.suitesData?._id;
  this.pageLoader = false;
},
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.toolsForm.valid) {
      this.btnLoader = true;
      if (this.toolsFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.toolsuites + ApiRoutesConstants.EDIT + "/" +  this.toolsFormControl['_id'].value;
        this.dataService.postData(apiUrl, this.toolsForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/list']);
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
        console.log("this.toolsForm.value",this.toolsForm.value);

        let apiUrl =ApiRoutesConstants.BASE_URL + ApiRoutesConstants.ToolsSuites_create;
          delete this.toolsForm.value._id
        this.dataService.postData(apiUrl, this.toolsForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/list']);
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
      this.toolsForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string,key:any) {
    if (key == "imageUrl") {
      this.toolsFormControl['imageUrl'].setValue(filePath);
    }else if(key == "tools"){
      this.toolsFormControl['tools'].setValue(filePath);
    }else if(key == "blogs"){
      this.toolsFormControl['blogs'].setValue(filePath);
    }else if (key == "priceimageUrl"){
      this.toolsFormControl['priceimageUrl'].setValue(filePath)
    }
  }

  removeImages(key:any) {
    if(key == "image") {
    this.toolsForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.toolsForm.patchValue({
      icon:''
    })
    }
  }
}
