import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../constants/alertservice';
import { Card } from '../../../../../Z-Commons/card/card';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { Data } from '../../../../../Service/data';
import { CommonModule, NgIf } from '@angular/common';
import { FileUpload } from "../../../../../Z-Commons/file-upload/file-upload";
import { FilePreview } from "../../../../../Z-Commons/file-preview/file-preview";

@Component({
  selector: 'app-level3-create-edit',
  imports: [Card, ReactiveFormsModule, FormsModule, NgIf, CommonModule,
    FileUpload,
    // FilePreview
  ],
  templateUrl: './level3-create-edit.html',
  styleUrls: ['./level3-create-edit.scss'],
  providers: [AlertService]
})
export class Level3CreateEdit {

  Level3Form!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  btnLoader: boolean = false;
  Data: any;
  editId: any;
  loader: boolean = true;
  selectedimage: any;
  tableData1: any[] = [];
  tableData2: any[] = [];
  isLevelStopped: boolean = false;
  cardTitle: string = 'Level 3 Create';

  private readonly apiUrls = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist;

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
     private cd: ChangeDetectorRef
  ) {
    this.Level3Form = this.fb.group({
      level1: [null, Validators.required],
      level2: [null, Validators.required],
      name: ['', Validators.required],
      icon:["",Validators.required],
      message: ['',Validators.required],
      levelStop:[false],
      _id: [null]
    });
  }

  ngOnInit(): void {
    this.getDatalevel1();
     this.Level3Form.get('level1')?.valueChanges.subscribe(level1Id => {
    if (level1Id) {
      this.getDataLevel2(level1Id);
    } else {
      this.tableData2 = [];
      this.Level3Form.patchValue({ level2: null });
    }
  });
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
  }

  get Level3FormControl() {
    return this.Level3Form.controls;
  }

  // Fetch level 1 data
  getDatalevel1() {
    this.loader = true;
    const data = { tableName: 'level1Schemachat' };

    this.navService.postData(this.apiUrls, data).subscribe({
      next: (res: any) => {
        if (res.Code === 200) {
          this.tableData1 = res.Data;
        } else {
          this.alertService.toast('error', true, res.Message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.alertService.toast('error', true, error);
      },
      complete: () => {
        this.loader = false;
      }
    });
  }

getDataLevel2(level1Id: string): Promise<void> {
  const data = { tableName: 'level2Schemachat', level1: level1Id };
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlistlevel_id;
  return new Promise((resolve) => {
    this.navService.postData(apiUrl, data).subscribe({
      next: (res: any) => {
        if (res.Code === 200) {
          this.tableData2 = res.Data ||[];
          console.log('level2',this.tableData2);

          this.cd.detectChanges();
        } else {
          this.alertService.toast('error', true, res.Message);
        }
        resolve();
      },
      error: (error: any) => {
        console.error(error);
        resolve();
      }
    });
  });
}

getById(id: any) {
  this.pageLoader = true;
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist_id;

  this.navService.postData(apiUrl, { _id: id, tableName: 'Level3Schemachat' }).subscribe({
    next: (res: any) => {
      this.Data = res.Data;

      // Step 1: patch Level 1 only
      this.Level3Form.patchValue({ level1: this.Data.level1 });

      // Step 2: fetch Level 2 options based on Level 1
      this.getDataLevel2(this.Data.level1).then(() => {
        // Step 3: patch Level 2 AFTER options are loaded
        this.Level3Form.patchValue({ level2: this.Data.level2 });
        // this.cd.detectChanges();
      });

      // Step 1: Set Level 1 first
      this.Level3Form.patchValue({
        level1: this.Data.level1,
        level2:this.Data.level2,
        name: this.Data.name,
        message: this.Data.message,
        icon:this.Data.icon,
        levelStop: this.Data.levelStop ?? false,
        _id: this.Data._id
      });

      // Step 2: Fetch Level 2 data based on Level 1
      const data = {
        tableName: 'level2Schemachat',
        level1: this.Data.level1
      };
      const apiUrlLevel2 = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlistlevel_id;

      this.navService.postData(apiUrlLevel2, data).subscribe({
        next: (res2: any) => {
          if (res2.Code === 200) {
            this.tableData2 = res2.Data;

            // Step 3: Now patch the Level 2 value
            this.Level3Form.patchValue({
              level2: this.Data.level2
            });
          }
        },
        complete: () => {
          this.pageLoader = false;
        }
      });

      this.editId = this.Data._id;
      this.cardTitle = this.Data._id ? 'Level 3 Edit' : 'Level 3 Create';
    },
    error: (error: any) => {
      console.error(error);
      this.pageLoader = false;
    }
  });
}


  // Submit or update
  submit() {
    if (this.Level3Form.valid) {
      const _data = {
        name: this.Level3Form.value.name,
        level1: this.Level3Form.value.level1,
        level2: this.Level3Form.value.level2,
        message: this.Level3Form.value.message,
        icon:this.Level3Form.value.icon,
        levelStop: this.Level3Form.value.levelStop,
        tableName: 'Level3Schemachat'
      };

      if (this.Level3FormControl['_id'].value) {
        const updateData = { ..._data, _id: this.Level3FormControl['_id'].value };
        const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatedit+"/"+this.Level3FormControl['_id'].value;

        this.navService.postData(apiUrl, updateData).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/level3']);
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
              this.router.navigate(['/admin/level3']);
            } else {
              this.alertService.toast('error', true, res.Message);
            }
          },
          error: (error: any) => console.error(error)
        });
      }
    } else {
      this.Level3Form.markAllAsTouched();
    }
  }

      onFilePathReceived(filePath: string) {
    this.Level3FormControl['icon'].setValue(filePath);
  }
  /** Toggle Level Stop */
  toggleLevelStop() {
    this.isLevelStopped = !this.isLevelStopped;
    console.log('Level Stop:', this.Level3Form.value.levelStop ? 'ON' : 'OFF');
  }

  removeImages(key:any) {
    if(key == "image") {
    this.Level3Form.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.Level3Form.patchValue({
      icon:''
    })
    }
  }
}
