import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';

import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { Data } from '../../../Service/data';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { FileUpload } from "../../../Z-Commons/file-upload/file-upload";
import { FilePreview } from "../../../Z-Commons/file-preview/file-preview";


@Component({
  selector: 'app-updates-create-edit',
    imports: [
    Card,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    FilePreview
],
  templateUrl: './updates-create-edit.html',
  styleUrl: './updates-create-edit.scss',
  providers: [AlertService],
})
export class UpdatesCreateEdit implements OnInit{
  newsForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  newsData: any;
  categoryData:any[] = []
  Types: any[] = ["url", "text", "image", "route"];
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  constructor(
    private fb: FormBuilder,
    private dataService: Data ,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ) {
    this.acRouter.paramMap.subscribe((param) => {
  const id = param.get('id'); // string | null

  if (!id || id === 'new') {
    return; // create mode
  }

  this.getById(id);
});
}

ngOnInit(): void {
  this.newsForm = this.fb.group({
    pagename: [null, Validators.required],
    news: [null, Validators.required],
    type: [null, Validators.required],
    data: [null],
    _id: [null],
  });

  this.newsForm.get('type')?.valueChanges.subscribe((type) => {
    const control = this.newsForm.get('data');

 
    control?.clearValidators();

    if (type === 'url') {
      control?.setValidators([
        Validators.required,
        Validators.pattern(/^(https?:\/\/)(?!.*\.(jpg|jpeg|png|gif|mp4|avi|mov)$).+/i)
      ]);
    }

    else if (type === 'text') {
      control?.setValidators([Validators.required]);
    }

    else if (type === 'image') {
      control?.setValidators([Validators.required]);
    }

    else if (type === 'route') {
      control?.setValidators([Validators.required]);
    }

    control?.updateValueAndValidity();
  });
}

  get newsFormControl() {
    return this.newsForm.controls;
  }

  getById(id: any) {
    this.pageLoader = true;
    let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.NEWS_SCROLL + ApiRoutesConstants.GET_LIST_ID + "/" +  id;
    this.dataService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log("news",res);
        this.newsData = res.Data;
        this.newsForm.patchValue({
          pagename:this.newsData.pagename,
          news:this.newsData.news,
          data:this.newsData.data,
          type: this.newsData.type,
          _id: this.newsData._id,
        });
        this.editId = this.newsData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    if (this.newsForm.valid) {
      this.btnLoader = true;
      if (this.newsFormControl['_id'].value) {
        let apiUrl =ApiRoutesConstants.BASE_URL + ApiRoutesConstants.NEWS_SCROLL + ApiRoutesConstants.EDIT + "/" +  this.newsFormControl['_id'].value;
        this.dataService.postData(apiUrl, this.newsForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/news-update']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.NEWS_SCROLL + ApiRoutesConstants.CREATE;
          // delete this.newsForm.value._id
        this.dataService.postData(apiUrl, this.newsForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/news-update']);
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
      this.newsForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.newsFormControl['data'].setValue(filePath);
  }
  formFieldNeedGetList() {
    this.getCategoryData();
  }
  getCategoryData(){
    let apiUrl = ApiRoutesConstants.BASE_URL+ ApiRoutesConstants.newscroll_getlist;
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
