import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';

@Component({
  selector: 'app-dues-create-edit',
  imports: [Card,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    FileUpload ,
    // FilePreview
   ],
  templateUrl: './dues-create-edit.html',
  styleUrl: './dues-create-edit.scss',
  providers: [AlertService],
})
export class DuesCreateEdit  implements OnInit{

    public btnLoader:boolean = false;
    categoryForm!: FormGroup;
    editAccess!: boolean;
    viewAccess!: boolean;
    pageLoader!: boolean;
    categoryData: any;
    selectedimage: any;
    editId: any;
    GlobalConstant: any = GlobalConstant;
    sidebarAccess: any;
    item: any;
    Data= [
    { role: 'Income' },
    { role: 'Expense' }
  ];
  selectItem: string = '';

      constructor(
        private fb: FormBuilder,
        private navService: Data ,
        private router: Router,
        private alertService: AlertService,
        private acRouter: ActivatedRoute
        ) {
            this.acRouter.paramMap.subscribe((param) => {
              var id = String(param.get('id'));
              console.log('id1', id);
              if(id!="null"){
                console.log('id', id);
                this.getById(id);
              }
            });
          }

  ngOnInit(): void {
  this.categoryForm = this.fb.group({
    catagory_type: ['', Validators.required],
    billdues_way: ['', Validators.required],
    icon: [null, Validators.required],
    _id: [null],
  });
}

  getroledata(event: any) {
    this.selectItem = event.target.value;
    console.log("Selected Role:", this.selectItem);
  }

  getById(id: string) {
        this.pageLoader = true;
    let apiUrl =
      ApiRoutesConstants.BASE_URL + ApiRoutesConstants.dues_and_remainders_getlist_id+ "/" +  id;
    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log('id',res);
        this.categoryData = res.data;
        console.log('categoryData',this.categoryData);

        this.categoryForm.patchValue({
          catagory_type: this.categoryData.catagory_type,
          billdues_way: this.categoryData.billdues_way,
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

    get categoryFormControl() {
    return this.categoryForm.controls;
  }

    submit() {
    if (this.categoryForm.valid) {
      this.btnLoader = true;
      if (this.categoryFormControl['_id'].value) {
        let apiUrl =
        ApiRoutesConstants.BASE_URL + ApiRoutesConstants.dues_and_remainders_edit + "/" +  this.categoryFormControl['_id'].value;
        this.navService.updateData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/due-remainder']);
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
          ApiRoutesConstants.BASE_URL + ApiRoutesConstants.dues_and_remainders_create;
          delete this.categoryForm.value._id
        this.navService.postData(apiUrl, this.categoryForm.value).subscribe({
          next: (res: any) => {
            console.log("create", res);
            if (res.code === 200) {
              this.alertService.toast('success', true, res.message);
              this.router.navigate(['/admin/due-remainder']);
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
      }
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

    onFilePathReceived(filePath: string) {
    this.categoryFormControl['icon'].setValue(filePath);
  }


  removeImages(key:any) {
    if(key == "image") {
    this.categoryForm.patchValue({
      image:''
    })
  }else if (key == "icon") {
    this.categoryForm.patchValue({
      icon:''
    })
    }
  }

}
