import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Data } from '../../../Service/data';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FilePreview } from '../../../Z-Commons/file-preview/file-preview';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';

@Component({
  selector: 'app-story-create-edit',
  imports: [Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf, FileUpload, FilePreview],
  templateUrl: './story-create-edit.html',
  styleUrl: './story-create-edit.scss',
  providers:[AlertService]
})
export class StoryCreateEdit {
  StoryBoardForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  StoryBoardData: any;
  categoryData:any[] = []
  public btnLoader:boolean = false;
  storyTypes = ["Image","Video"];
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(
    private fb: FormBuilder,
    private dataService: Data,
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
  this.StoryBoardForm = this.fb.group({
    mediaType:[null, Validators.required],
    title:[''],
    mediaUrl:[null, Validators.required],
    notifi_title:[null],
    notifi_body:[null],
    expiryDays: [1, Validators.required],
    _id: [null], 
  });
  this.formFieldNeedGetList();
}

  get StoryBoardFormControl() {
    return this.StoryBoardForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.StoryBoardGetlistID ;
    this.dataService.postData(apiUrl,{_id: id }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.StoryBoardData = res.Data[0];
        this.StoryBoardForm.patchValue({
          mediaType:this.StoryBoardData.mediaType,
          title:this.StoryBoardData.title,              
          _id: this.StoryBoardData._id,                 
          mediaUrl:this.StoryBoardData.mediaUrl,        
          notifi_title:this.StoryBoardData.notifi_title,
          notifi_body:this.StoryBoardData.notifi_body,   
          expiryDays:this.StoryBoardData.expiryDays,   
        });
        this.editId = this.StoryBoardData._id; 
        this.pageLoader = false;                
      },
      error: (error: any) => {  
        this.pageLoader = false;
      },
    });
  }

submit() {
  if (this.StoryBoardForm.valid) {
    this.btnLoader = true;

    let formValue = { ...this.StoryBoardForm.value };

    // ✅ Optional: if backend expects expiryDate instead of days
    // (skip this if backend uses expiryDays directly)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + formValue.expiryDays);
    formValue.expiryDate = expiry;

    if (formValue._id) {
      let apiUrl =
        ApiRoutesConstants.BASE_URL +
        ApiRoutesConstants.StoryBoardEdit +
        "/" +
        formValue._id;

      this.dataService.postData(apiUrl, formValue).subscribe({
        next: (res: any) => {
          if (res.Code === 200) {
            this.alertService.toast('success', true, res.Message);
            this.router.navigate(['/admin/storyboard']);
          } else {
            this.alertService.toast('error', true, res.Message);
          }
          this.btnLoader = false;
        },
        error: (error: any) => {
          console.log(error);
          this.btnLoader = false;
        },
      });

    } else {
      let apiUrl =
        ApiRoutesConstants.BASE_URL +
        ApiRoutesConstants.StoryBoardCreate;

      delete formValue._id;

      this.dataService.postData(apiUrl, formValue).subscribe({
        next: (res: any) => {
          if (res.Code === 200) {
            this.alertService.toast('success', true, res.Message);
            this.router.navigate(['/admin/storyboard']);
          } else {
            this.alertService.toast('error', true, res.Message);
          }
          this.btnLoader = false;
        },
        error: (error: any) => {
          console.log(error);
          this.btnLoader = false;
        },
      });
    }

  } else {
    this.StoryBoardForm.markAllAsTouched();
  }
}
  onFilePathReceived(filePath: string) {
    this.StoryBoardFormControl['mediaUrl'].setValue(filePath);
  }
  formFieldNeedGetList() {
    this.getCategoryData();
  }
  getCategoryData(){
    let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.StoryBoardGetlistAll;
    this.dataService.getData(apiUrl).subscribe({
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

}
