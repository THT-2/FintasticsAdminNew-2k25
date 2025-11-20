import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';
import { FilePreview } from '../../../Z-Commons/file-preview/file-preview';
import { FileUpload } from '../../../Z-Commons/file-upload/file-upload';

@Component({
  selector: 'app-onboard-create-edit',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Card,
    FileUpload,
    FilePreview
  ],
  templateUrl: './onboard-create-edit.html',
  styleUrl: './onboard-create-edit.scss',
  providers: [AlertService]
})
export class OnboardCreateEdit {

  questionForm: FormGroup;
  GlobalConstant: any = GlobalConstant;
  pageLoader: boolean = false;
  btnLoader: boolean = false;
  OnBoardingData: any;
  editId: any;
  constructor(private fb: FormBuilder,private navService:Data,private acRouter: ActivatedRoute,private router:Router,private alertService:AlertService,) {
  this.acRouter.paramMap.subscribe((param) => {
      var id = String(param.get('id'));
      if(id != 'null'){
        this.getById(id);
      }
    });

    this.questionForm = this.fb.group({
      questionText: ['', Validators.required],
      description: [''],
      type: ['single-choice', Validators.required],
      isRequired: [false],
      allowSkip: [true],
      placeholder: [''],
      inputType: ['text'],
      allowCustomInput: [false],
      order: [0, Validators.required],
      options: this.fb.array([]),
      _id: [null],
    });

  }
 get questionFormControl() {
    return this.questionForm.controls;
  }
   get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.group({
      label: ['', Validators.required],
      value: ['', Validators.required],
      icon: [''],
    }));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

     getById(id: string) {
    this.pageLoader = true;
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.OnBoardingQuestions_getlist_id + '/' + id;

    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        if (res.Code === 200) {
          console.log(res);

             this.OnBoardingData = res.Data;
        const data = this.OnBoardingData;

        this.questionForm.patchValue({
          questionText: data.questionText,
          description: data.description,
          type: data.type,
          isRequired: data.isRequired,
          allowSkip: data.allowSkip,
          placeholder: data.placeholder,
          inputType: data.inputType,
          order: data.order,
          _id: data._id
        });

        this.options.clear();
        data.options.forEach((opt: any) => {
          this.options.push(
            this.fb.group({
              label: [opt.label, Validators.required],
              value: [opt.value, Validators.required],
              icon: [opt.icon || '']
            })
          );
        });

        this.editId = data._id;
        this.pageLoader = false;
        }

      },
      error: () => {
        this.pageLoader = false;
      }
    });
  }

   onSubmit() {
      console.log("this.questionForm",this.questionForm);

      if (this.questionForm.valid) {
        this.btnLoader = true;
        if (this.questionFormControl['_id'].value) {
          let apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.OnBoardingQuestionsEdit + "/" +  this.questionFormControl['_id'].value;
          this.navService.postData(apiUrl, this.questionForm.value).subscribe({
            next: (res: any) => {
              if (res.Code === 200) {
                this.alertService.toast('success', true, res.Message);
                this.router.navigate(['/admin/questions']);
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
            ApiRoutesConstants.BASE_URL + ApiRoutesConstants.OnBoardingQuestions_create;
            delete this.questionForm.value._id
          this.navService.postData(apiUrl, this.questionForm.value).subscribe({
            next: (res: any) => {
              if (res.Code === 200) {
                this.alertService.toast('success', true, res.Message);
                this.router.navigate(['/admin/questions']);
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
        this.questionForm.markAllAsTouched();
      }
    }
     onFilePathReceived(filePath: string, index: number) {
    const optionGroup = this.options.at(index) as FormGroup;
    optionGroup.get('icon')?.setValue(filePath);
  }

}
