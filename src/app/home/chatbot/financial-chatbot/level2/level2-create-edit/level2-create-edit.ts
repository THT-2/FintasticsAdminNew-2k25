import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../../Z-Commons/card/card';
import { AlertService } from '../../../../../constants/alertservice';
import { Data } from '../../../../../Service/data';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { CommonModule, NgIf } from '@angular/common';
import { FileUpload } from "../../../../../Z-Commons/file-upload/file-upload";
import { FilePreview } from "../../../../../Z-Commons/file-preview/file-preview";

@Component({
  selector: 'app-level2-create-edit',
  imports: [
    Card,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CommonModule,
    FileUpload,
    // FilePreview
],
  templateUrl: './level2-create-edit.html',
  styleUrls: ['./level2-create-edit.scss'],
  providers: [AlertService]
})
export class Level2CreateEdit {

  Level2Form!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  selectedimage: any;
  btnLoader: boolean = false;
  cardTitle: string = 'Level 2 Create';
  isLevelStopped: boolean = false;
  Data: any;
  editId: any;
  loader: boolean = true;
  tableData1: any[] = [];

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.Level2Form = this.fb.group({
      level1: ['', Validators.required],
      name: ['', Validators.required],
      icon:["",Validators.required],
      message: ['',Validators.required],
      levelStop: [false],
      _id: [null]
    });
  }

ngOnInit(): void {
  this.getLevel1Data().then(() => {
    this.acRouter.paramMap.subscribe((param) => {
      const id = String(param.get('id'));
      if (id !== 'null') {
        this.editAccess = true;
        if (sessionStorage.getItem('View') === 'View') {
          this.viewAccess = true;
        }
        this.getById(id);
      } else {
        this.pageLoader = false;
      }
    });
  });
}

  get Level2FormControl() {
    return this.Level2Form.controls;
  }

/** Load Level 1 Dropdown Data */
getLevel1Data(): Promise<void> {
  this.loader = true;
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist;
  const data = { tableName: 'level1Schemachat' };

  return new Promise((resolve, reject) => {
    this.navService.postData(apiUrl, data).subscribe({
      next: (res: any) => {
        if (res.Code === 200) {
          this.tableData1 = res.Data || [];
          this.cd.detectChanges();
          resolve();
        } else {
          this.alertService.toast('error', true, res.Message);
          resolve();
        }
      },
      error: (error: any) => {
        console.error(error);
        this.alertService.toast('error', true, 'Failed to fetch Level 1 data.');
        resolve(); // resolve anyway
      },
      complete: () => {
        this.loader = false;
      }
    });
  });
}

  getById(id: any) {
    this.pageLoader = true;
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist_id;

    this.navService.postData(apiUrl, { _id: id, tableName: 'level2Schemachat' }).subscribe({
      next: (res: any) => {
        this.Data = res.Data;
        this.Level2Form.patchValue({
          name: this.Data.name,
          level1: this.Data.level1,
          message: this.Data.message,
          icon:this.Data.icon,
          levelStop: this.Data.levelStop ?? false,
          _id: this.Data._id
        });

        this.editId = this.Data._id;
        this.cardTitle = this.Data._id ? 'Level 2 Edit' : 'Level 2 Create';
        this.pageLoader = false;
      },
      error: (error: any) => {
        console.error(error);
        this.pageLoader = false;
      }
    });
  }

  /** Form Submission (Create or Update) */
  submit() {

console.log("leve2 valid",this.Level2Form);

    if (this.Level2Form.valid) {

      const _data = {
        level1: this.Level2Form.value.level1,
        name: this.Level2Form.value.name,
        message: this.Level2Form.value.message,
        icon:this.Level2Form.value.icon,
        levelStop: this.Level2Form.value.levelStop,
        tableName: 'level2Schemachat'
      };

      if (this.Level2FormControl['_id'].value) {

        const updateData = { ..._data, _id: this.Level2FormControl['_id'].value };
        const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatedit+"/"+this.Level2FormControl['_id'].value;

        this.navService.postData(apiUrl, updateData).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/level2']);
            } else {
              this.alertService.toast('error', true, res.Message);
            }
          },
          error: (error: any) => console.error(error)
        });
      } else {

        const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatcreate;

        this.navService.postData(apiUrl, _data).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/level2']);
            } else {
              this.alertService.toast('error', true, res.Message);
            }
          },
          error: (error: any) => console.error(error)
        });
      }
    } else {
      this.Level2Form.markAllAsTouched();
    }
  }

      onFilePathReceived(filePath: string) {
    this.Level2FormControl['icon'].setValue(filePath);
  }
  /** Toggle Level Stop */
  toggleLevelStop() {
    this.isLevelStopped = !this.isLevelStopped;
    console.log('Level Stop:', this.Level2Form.value.levelStop ? 'ON' : 'OFF');
  }

  removeImages(key:any) {
    if(key == "image") {
    this.Level2Form.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.Level2Form.patchValue({
      icon:''
    })
    }
  }
}
