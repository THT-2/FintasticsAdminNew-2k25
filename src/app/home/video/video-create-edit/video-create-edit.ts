import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {ActivatedRoute,Router,} from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Data } from '../../../Service/data';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FilePreview } from '../../../Z-Commons/file-preview/file-preview';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';



@Component({
  selector: 'app-video-create-edit',
  imports: [FileUpload, FilePreview, Card,ReactiveFormsModule,FormsModule,NgIf,CommonModule],
  templateUrl: './video-create-edit.html',
  styleUrl: './video-create-edit.scss',
  providers:[AlertService]
})
export class VideoCreateEdit implements OnInit{

  videoForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  videoData: any;
  public btnLoader:boolean = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;
  selectedimage: any;

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
  this.videoForm = this.fb.group({
    title: ['', Validators.required],
    videolink: [null, Validators.required],
    tamp_img: [null],
    video_img:[null],
    description: [null],
    _id: [null],
    videotype:["videoLink"],
    index:[null, Validators.required]
  });
}

  get videoFormControl() {
    return this.videoForm.controls;
  }
  getById(id: any) {
    this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.VIDEO_UPLOAD + ApiRoutesConstants.GET_LIST_ID + "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log('video',res);
        this.videoData = res.Data;
        this.videoForm.patchValue({
          title: this.videoData.title,
          videolink: this.videoData.videolink,
          tamp_img:this.videoData.tamp_img,
          video_img:this.videoData.video_img,
          description:this.videoData.description,
          _id: this.videoData._id,
          index:this.videoData.index
        });
        this.editId = this.videoData._id;
        this.pageLoader = false;
      },
      error: (error: any) => {
        this.pageLoader = false;
      },
    });
  }

  submit() {
    console.log(this.videoForm);

    if (this.videoForm.valid) {
      this.btnLoader = true;
      if (this.videoFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.VIDEO_UPLOAD + ApiRoutesConstants.EDIT + "/" +  this.videoFormControl['_id'].value;
        this.navService.postData(apiUrl, this.videoForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/video']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.VIDEO_UPLOAD + ApiRoutesConstants.CREATE;
          delete this.videoForm.value._id
        this.navService.postData(apiUrl, this.videoForm.value).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/video']);
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
      this.videoForm.markAllAsTouched();
    }
  }
  onFilePathReceived(filePath: string) {
    this.videoFormControl['tamp_img'].setValue(filePath);
  }
  onvideoImgPathReceived(filePath: string) {
    this.videoFormControl['video_img'].setValue(filePath);
  }
  onVideoPathReceived(filePath: string) {
    this.videoFormControl['videolink'].setValue(filePath);
  }

  removeImages(key:any) {
    if(key == "image") {
    this.videoForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.videoForm.patchValue({
      icon:''
    })
    }
  }

}
