import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../../Z-Commons/card/card';
import { AlertService } from '../../../../../constants/alertservice';
import { Data } from '../../../../../Service/data';
import { ApiRoutesConstants } from '../../../../../constants/api-route-constants';
import { CommonModule, NgIf } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { routes } from '../../../../../app.routes';
import { FileUpload } from "../../../../../Z-Commons/file-upload/file-upload";
import { FilePreview } from "../../../../../Z-Commons/file-preview/file-preview";

@Component({
  selector: 'app-level1-create-edit',
  imports: [
    Card,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CommonModule,
    FileUpload,
    // FilePreview
],
  templateUrl: './level1-create-edit.html',
  styleUrls: ['./level1-create-edit.scss'],
  providers:[AlertService]
})
export class Level1CreateEdit implements AfterViewInit{

  Level1Form!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  Data: any;
  editId: any;
  selectedimage: any;
  btnLoader: boolean = false;
  isLevelStopped: boolean = false;
  cardTitle: string = 'Level 1 Create';

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute
  ){
    this.Level1Form = this.fb.group({
      name: ['', Validators.required],
      message:['',Validators.required],
      levelStop: [false],
      icon:["",Validators.required],
      _id: [null]
    });
  }
    ngAfterViewInit() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  ngOnInit(): void {
    this.acRouter.paramMap.subscribe((param) => {
      const id = String(param.get('id'));
      if(id !== 'null'){
        this.editAccess = true;
        if(sessionStorage.getItem('View') === 'View'){
          this.viewAccess = true;
        }
        this.getById(id);
      } else {
        this.pageLoader = false;
      }
    });
  }


  get Level1FormControl() {
    return this.Level1Form.controls;
  }

getById(id: any) {
  this.pageLoader = true;
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatgetlist_id;

  this.navService.postData(apiUrl, { _id: id, tableName: "level1Schemachat" }).subscribe({
    next: (res: any) => {
      this.Data = res.Data;
      console.log('Fetched Level1 Data:', this.Data);

      this.Level1Form.patchValue({
        name: this.Data.name,
        message: this.Data.message,
        icon:this.Data.icon ??'',
        levelStop: this.Data.levelStop ?? false,
        _id: this.Data._id
      });

      this.editId = this.Data._id;
      this.cardTitle = this.Data._id ? 'Level 1 Edit' : 'Level 1 Create';
      this.pageLoader = false;
    },
    error: (error: any) => {
      this.pageLoader = false;
      console.error(error);
    }
  });
}


  submit() {
    if (this.Level1Form.valid) {
      const _data = {
      name: this.Level1Form.value.name,
      message: this.Level1Form.value.message,
      icon:this.Level1Form.value.icon,
      levelStop: this.Level1Form.value.levelStop,
      tableName:"level1Schemachat"
    };

      if(this.Level1FormControl['_id'].value) {
        const updateData = {
          ..._data,
          _id: this.Level1FormControl['_id'].value
        };
        const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatedit + "/" + this.Level1FormControl['_id'].value;
        this.navService.postData(apiUrl, updateData).subscribe({
          next:(res:any)=> {
            if (res.Code === 200) {
              this.alertService.toast("success", true, res.Message);
              this.router.navigate(['/admin/level1']);
            } else {
              this.alertService.toast("error", true, res.Message);
            }
          },
          error: (error:any) => console.error(error)
        });
      } else {
        const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.financialbotchatcreate;
        this.navService.postData(apiUrl, _data).subscribe({
          next:(res:any)=> {
            if (res.Code === 200) {
              this.alertService.toast("success", true, res.Message);
              this.router.navigate(['/admin/level1']);
            } else {
              this.alertService.toast("error", true, res.Message);
            }
          },
          error: (error:any) => console.error(error)
        });
      }
    } else {
      this.Level1Form.markAllAsTouched();
    }
  }

    onFilePathReceived(filePath: string) {
    this.Level1FormControl['icon'].setValue(filePath);
  }

  toggleLevelStop() {
    this.isLevelStopped = !this.isLevelStopped;
    console.log('Level Stop:', this.Level1Form.value.levelStop ? 'ON' : 'OFF');
  }


  removeImages(key:any) {
    if(key == "image") {
    this.Level1Form.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.Level1Form.patchValue({
      icon:''
    })
    }
  }
}
