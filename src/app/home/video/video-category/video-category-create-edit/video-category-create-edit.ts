import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { OnInit } from '@angular/core';
import {ActivatedRoute,Router,} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { FilePreview } from '../../../../Z-Commons/file-preview/file-preview';
import { FileUpload } from '../../../../Z-Commons/file-upload/file-upload';
import { AlertService } from '../../../../constants/alertservice';
import { GlobalConstant } from '../../../../constants/global-constants';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';


@Component({
  selector: 'app-video-category-create-edit',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    FilePreview,
    NgIf],
  templateUrl: './video-category-create-edit.html',
  styleUrl: './video-category-create-edit.scss',
  providers: [AlertService],
})
export class VideoCategoryCreateEdit implements OnInit{

  videoForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  categoryData: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {

    this.videoForm = this.fb.group({
    categoryname: ['', Validators.required],
    icon: [null, Validators.required],
    _id: [null],
  }); 
  
    effect(() => {
    const id = this.navService.userId();

    if (id) {
      this.getById(id);
    }
  });
    // this.acRouter.paramMap.subscribe((param) => {
    //   var id = String(param.get('id'));
    //   if(id != 'null'){
    //     this.getById(id);
    //   }
    // });
  }
ngOnInit(): void {
  this.videoForm = this.fb.group({
    categoryname: ['', Validators.required],
    icon: [null],
    _id: [null],
  });
 
}
get isEditMode(): boolean {
  return !!this.videoForm?.get('_id')?.value;
}

  get videoFormControl() {
    return this.videoForm.controls;
  }

  getById(id: any) {
  this.pageLoader = true;

  let apiUrl =
    ApiRoutesConstants.BASE_URL +
    ApiRoutesConstants.video_category_getlistId;

  const body = {
    _id: id
  };

  this.navService.postData(apiUrl, body).subscribe({
    next: (res: any) => {
      console.log(res);

      this.categoryData = res.data;

      this.videoForm.patchValue({
        categoryname: this.categoryData.categoryname,
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
    if (this.videoForm.valid) {
      this.btnLoader = true;
      if (this.videoFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.video_category_edit + "/" +  this.videoFormControl['_id'].value;
        this.navService.postData(apiUrl, this.videoForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/video']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.video_category_create;
          delete this.videoForm.value._id
        this.navService.postData(apiUrl, this.videoForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/video']);
              this.btnLoader = false;
            } else {
              this.alertService.toast('error', true, res.message);
              this.btnLoader = false;
            }
            this.cd.detectChanges();
          },
          error: (error: any) => {
            console.log(error);
            this.btnLoader = false;
          },
        });
      }
    } else {
      this.videoForm.markAllAsTouched();
    }
    this.videoForm.reset();
this.videoForm.patchValue({_id: null});
  }
  onFilePathReceived(filePath: string) {
    this.videoFormControl['icon'].setValue(filePath);
  }
}
