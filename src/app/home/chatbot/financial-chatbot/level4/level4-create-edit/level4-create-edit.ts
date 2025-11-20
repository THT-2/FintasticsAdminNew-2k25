import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../../Z-Commons/card/card';
import { AlertService } from '../../../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { Data } from '../../../../../Service/data';
import { CommonModule, NgIf } from '@angular/common';
import { FilePreview } from "../../../../../Z-Commons/file-preview/file-preview";
import { FileUpload } from "../../../../../Z-Commons/file-upload/file-upload";

@Component({
  selector: 'app-level4-create-edit',
  imports: [Card, ReactiveFormsModule, FormsModule, NgIf, CommonModule,
    //  FilePreview,
    FileUpload],
  templateUrl: './level4-create-edit.html',
  styleUrls: ['./level4-create-edit.scss'],
  providers: [AlertService]
})
export class Level4CreateEdit {

  Level4Form!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  btnLoader: boolean = false;
  Data: any;
  editId: any;
  loader: boolean = true;
  selectedimage: any;
  tableData1: any[] = [];   // level1 list
  tableData2: any[] = [];    // level2 list
  tableData3: any[] = [];  // level3 list
  isLevelStopped: boolean = false;
  cardTitle: string = 'Level 4 Create';

  private readonly apiUrls = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist;

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
    private cd:ChangeDetectorRef
  ) {
    this.Level4Form = this.fb.group({
      level1: [null, Validators.required],
      level2: [null, Validators.required],
      level3: [null,Validators.required],
      levelStop:[false],
      icon:["",Validators.required],
      message: ['',Validators.required],
      name: ['', Validators.required],
      _id: [null]
    });
  }

  ngOnInit(): void {
    this.getDatalevel1();

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

  get Level4FormControl() {
    return this.Level4Form.controls;
  }

  // ─── GET LEVEL 1 DATA ───────────────────────────────────────────────
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
      complete: () => (this.loader = false)
    });
  }

  // ─── GET LEVEL 2 DATA ───────────────────────────────────────────────
  getDataLevel2() {
    this.loader = true;
    const data = {
      tableName: 'level2Schemachat',
      level1: this.Level4Form.value.level1
    };
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlistlevel_id;

    this.navService.postData(apiUrl, data).subscribe({
      next: (res: any) => {
        if (res.Code === 200) {
          this.tableData2 = res.Data ||[];
          console.log("Datalevel2",this.tableData2);

        } else {
          this.alertService.toast('error', true, res.Message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.alertService.toast('error', true, error);
      },
      complete: () => (this.loader = false)
    });
  }

  // ─── GET LEVEL 3 DATA ───────────────────────────────────────────────
  getDataLevel3() {
    this.loader = true;
    const data = {
      tableName: 'Level3Schemachat',
      level2: this.Level4Form.value.level2
    };
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlistlevel_id;

    this.navService.postData(apiUrl, data).subscribe({
      next: (res: any) => {
        if (res.Code === 200) {
          this.tableData3 = res.Data ;
          console.log("level3",this.tableData3);

        } else {
          this.alertService.toast('error', true, res.Message);
        }
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.alertService.toast('error', true, error);
      },
      complete: () => (this.loader = false)
    });
  }

  // ─── GET BY ID (EDIT MODE) ──────────────────────────────────────────
  getById(id: any) {
    this.pageLoader = true;
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist_id;

    this.navService.postData(apiUrl, { _id: id, tableName: 'Level4Schemachat' }).subscribe({
      next: (res: any) => {
        this.Data = res.Data;

        this.Level4Form.patchValue({
          name: this.Data.name,
          level1: this.Data.level1,
          level2: this.Data.level2,
          level3: this.Data.level3,
          message: this.Data.message,
          icon:this.Data.icon,
          levelStop: this.Data.levelStop,
          _id: this.Data._id
        });

        this.getDataLevel2();
        this.getDataLevel3();

        this.editId = this.Data._id;
        this.cardTitle = this.Data._id ? 'Level 4 Edit' : 'Level 4 Create';
        this.pageLoader = false;
      },
      error: (error: any) => {
        console.error(error);
        this.pageLoader = false;
      }
    });
  }

  // ─── SUBMIT OR UPDATE ───────────────────────────────────────────────
  submit() {
    if (this.Level4Form.valid) {
      const _data = {
        name: this.Level4Form.value.name,
        level1: this.Level4Form.value.level1,
        level2: this.Level4Form.value.level2,
        level3: this.Level4Form.value.level3,
        icon:this.Level4Form.value.icon,
        levelStop: this.Level4Form.value.levelStop,
        message: this.Level4Form.value.message,
        tableName: 'Level4Schemachat'
      };

      if (this.Level4FormControl['_id'].value) {
        const updateData = { ..._data, _id: this.Level4FormControl['_id'].value };
        const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatedit+"/"+this.Level4FormControl['_id'].value;

        this.navService.postData(apiUrl, updateData).subscribe({
          next: (res: any) => {
            if (res.Code === 200) {
              this.alertService.toast('success', true, res.Message);
              this.router.navigate(['/admin/level4']);
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
              this.router.navigate(['/admin/level4']);
            } else {
              this.alertService.toast('error', true, res.Message);
            }
          },
          error: (error: any) => console.error(error)
        });
      }
    } else {
      this.Level4Form.markAllAsTouched();
    }
  }

      onFilePathReceived(filePath: string) {
    this.Level4FormControl['icon'].setValue(filePath);
  }
    /** Toggle Level Stop */
  toggleLevelStop() {
    this.isLevelStopped = !this.isLevelStopped;
    console.log('Level Stop:', this.Level4Form.value.levelStop ? 'ON' : 'OFF');
  }


  removeImages(key:any) {
    if(key == "image") {
    this.Level4Form.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.Level4Form.patchValue({
      icon:''
    })
    }
  }
}
