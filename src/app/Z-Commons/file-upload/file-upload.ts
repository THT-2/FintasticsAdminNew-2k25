import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertService } from '../../constants/alertservice';
import { Data } from '../../Service/data';
import { ApiRoutesConstants } from '../../constants/api-route-constants';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
  providers:[AlertService]
})
export class FileUpload {

  fileUploadControl!: FormControl;
  @Output() getFilePath = new EventEmitter();
  loading = false;

  constructor(private navservice:Data, private alertService:AlertService,) {

  }
  ngOnInit(): void {
    this.fileUploadControl = new FormControl([]);
  }
  // onFileSelect(event: any) {
  //   if (event.target.files && event.target.files.length > 0) {
  //     console.log("Selected files:", event.target.files);

  //     const formData = new FormData();
  //     const maxSize = 500 * 1024 * 1024; // 500MB

  //     for (let file of event.target.files) {
  //       if (file.size > maxSize) {
  //         this.alertService.toast("error", true, "File size exceeds the 500MB limit.");
  //         return;
  //       }
  //       formData.append('sampleFile', file);
  //     }

  //     const imageUploadUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.UPLOAD;
  //     this.service.postData(imageUploadUrl, formData).subscribe({
  //       next: (res: any) => {
  //         if (res['Status'] === 'Success') {
  //           const filePath = res.Data;
  //           this.getFilePath.emit(filePath);
  //           this.alertService.toast("success", true, res.Message);
  //         } else {
  //           this.alertService.toast("error", true, res.Message);
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Upload error:', error);
  //         this.alertService.toast("error", true, error.error.Message || "Upload failed.");
  //       }
  //     });
  //   }
  // }


onFileSelect(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    const formData = new FormData();
    for (let file of event.target.files) {
      formData.append('sampleFile', file);
    }

    const imageUploadUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.UPLOAD;

    this.loading = true;

    const timeout = setTimeout(() => {
      this.loading = false;
      this.alertService.toast("error", true, "Upload timed out after 5 minutes.");
    }, 300000);

    this.navservice.UploadpostData(imageUploadUrl, formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * event.loaded) / (event.total || 1));
          console.log(`File is ${percentDone}% uploaded.`);
        } else if (event.type === HttpEventType.Response) {
          clearTimeout(timeout);
          this.loading = false;

          const res: any = event.body;
          if (res?.Status === 'Success') {
            this.getFilePath.emit(res.Data);
            this.alertService.toast("success", true, res.Message);
          } else {
            this.alertService.toast("error", true, res.Message);
          }
        }
      },
      error: (error) => {
        clearTimeout(timeout);
        this.loading = false;
        this.alertService.toast("error", true, error?.error?.Message || 'Upload failed.');
      }
    });
  }
}

}
