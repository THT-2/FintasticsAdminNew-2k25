import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../constants/alertservice';
import { FilePreview } from '../../../../Z-Commons/file-preview/file-preview';
import { FileUpload } from '../../../../Z-Commons/file-upload/file-upload';
import { Card } from '../../../../Z-Commons/card/card';
import { GlobalConstant } from '../../../../constants/global-constants';
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';

@Component({
  selector: 'app-subscription-create-edit',
  imports: [
    Card,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    FilePreview,
    NgIf,
  ],
  templateUrl: './subscription-create-edit.html',
  styleUrl: './subscription-create-edit.scss',
  providers: [AlertService],
})
export class SubscriptionCreateEdit implements OnInit {
  subscriptionForm!: FormGroup;
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  subscriptionData: any;
  categoryData: any[] = [];
  public btnLoader = false;
  editId: any;
  GlobalConstant: any = GlobalConstant;

  isEditMode = false;
  pageTitle = 'Add  Subscription';

  BenefitsDatas: any[] = [];
  OffersIncludes: any[] = [];
  subscriptionTypes = ["Free","Basic","Standard","Premium","UltraPremium"];
  iosProducts:any[]= [];


  modalType: 'benefit' | 'offer' = 'benefit';
  modalTitle = 'Add Benefit';
  editingIndex: number | null = null;

  newOffer: any = { title: '', icon: '', description: '' };
  newBenefit: any = { title: '', description: '' };

  constructor(
    private fb: FormBuilder,
    private navService: Data,
    private router: Router,
    private alertService: AlertService,
    private acRouter: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.acRouter.snapshot.paramMap.get('id');
    this.isEditMode = !!id && id !== 'null';
    this.pageTitle = `${this.isEditMode ? this.GlobalConstant.EDIT : this.GlobalConstant.ADD} Subscription`;

    this.subscriptionForm = this.fb.group({
      currency: [null, Validators.required],
      currency_symbol: [null, Validators.required],
      iosproductId :[null,Validators.required],
      months: [null, Validators.required],
      type: [null, Validators.required],
      title: [null, Validators.required],
      amount: [null, Validators.required],
      duration: [null, Validators.required],
      plan_tag: [null],
      totaldays: [null, Validators.required],
      Benefits: [null],
      benefitContent: [null],
      offerAmount: [null, Validators.required],
      referralPoints: [null, Validators.required],
      colorCode: [null, Validators.required],
      index: [null, Validators.required],
      icon: ['', Validators.required],
      bannerImg: ['',Validators.required],
      _id: [null],
    });

    if (this.isEditMode && id) {
      this.getById(id);
    }
    console.log('Subs',this.subscriptionForm);
    this.getIosProducts();
  }

  get subscriptionFormControl() {
    return this.subscriptionForm.controls;
  }


  getIosProducts() {
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.ProductId;
  this.navService.getData(apiUrl).subscribe((res: any) => {
    if (res.code === 200) {
      this.iosProducts = res.data;
      console.log("productid",this.iosProducts);
    }
    this.cd.detectChanges();
  });
}

  getById(id: any) {
    this.pageLoader = true;
    const apiUrl =
      ApiRoutesConstants.BASE_URL +ApiRoutesConstants.SUBSCRIPTION +ApiRoutesConstants.GET_LIST_ID +'/' + id;

    this.navService.getData(apiUrl).subscribe({
      next: (res: any) => {
        this.subscriptionData = res.data;

        console.log("subscriptionData",this.subscriptionData);


        this.subscriptionForm.patchValue({
          currency: this.subscriptionData.currency,
          currency_symbol: this.subscriptionData.currency_symbol,
          iosproductId : this.subscriptionData.iosproductId ,
          months: this.subscriptionData.months,
          type: this.subscriptionData.type,
          title: this.subscriptionData.title,
          amount: this.subscriptionData.amount,
          duration: this.subscriptionData.duration,
          plan_tag: this.subscriptionData.plan_tag,
          _id: this.subscriptionData._id,
          totaldays: this.subscriptionData.totaldays,
          offerAmount: this.subscriptionData.offerAmount,
          colorCode: this.subscriptionData.colorCode,
          index: this.subscriptionData.index,
          referralPoints: this.subscriptionData.referralPoints,
          icon: this.subscriptionData.icon,
          bannerImg: this.subscriptionData.bannerImg ?? '',

        });

        this.OffersIncludes = (this.subscriptionData.featuresIncludes || []).map((o: any) => ({
          icon: o?.icon ?? '',
          title: o?.title ?? '',
          description: o?.description ?? '',
        }));

        this.BenefitsDatas = (this.subscriptionData.planFeatures || []).map((b: any) => ({
          title: b?.title ?? '',
          description: b?.description ?? '',
        }));

        this.editId = this.subscriptionData._id;
        this.pageLoader = false;
      },
      error: () => { this.pageLoader = false; },
    });
    this.cd.detectChanges();
  }

  submit() {
  if (!this.subscriptionForm.valid) {
    this.subscriptionForm.markAllAsTouched();
    return;
  }

  this.btnLoader = true;

  const payload: any = {
    ...this.subscriptionForm.value,
    featuresIncludes: this.OffersIncludes,
    planFeatures: this.BenefitsDatas,
  };

  // guarantee bannerImg is a trimmed string
  payload.bannerImg = String(this.subscriptionFormControl['bannerImg'].value ?? '').trim();

  const isEdit = !!this.subscriptionFormControl['_id'].value;
  const apiUrl = isEdit
    ? ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SUBSCRIPTION + ApiRoutesConstants.EDIT + '/' + this.subscriptionFormControl['_id'].value
    : ApiRoutesConstants.BASE_URL + ApiRoutesConstants.SUBSCRIPTION + ApiRoutesConstants.CREATE;

  if (!isEdit) delete payload._id;

  this.navService.postData(apiUrl, payload).subscribe({
    next: (res: any) => {
      if (res.code === 200) {
        this.alertService.toast('success', true, res.message);
        this.router.navigate(['/admin/plans']);
      } else {
        this.alertService.toast('error', true, res.message);
      }
      this.btnLoader = false;
    },
    error: () => { this.btnLoader = false; },
  });
}


 onFilePathReceived(filePath: string) {
  if (this.modalType === 'offer') {
    this.newOffer.icon = filePath;
  } else {
    this.subscriptionFormControl['icon'].setValue(filePath);
  }
}

  // onFilePathbannerReceived(filePath: string) {
  //   this.subscriptionFormControl['bannerImg'].setValue(filePath);
  // }


onFilePathbannerReceived(filePath: string | string[]) {
  const value = Array.isArray(filePath) ? (filePath[0] ?? '') : (filePath ?? '');
  this.subscriptionFormControl['bannerImg'].setValue(String(value));
  this.subscriptionFormControl['bannerImg'].markAsDirty();
}



  addBenefits(kind: 'Benefits' | 'benefitContent') {
    if (kind === 'Benefits') {
      const raw = (this.subscriptionForm.value.Benefits || '').trim?.() ?? '';
      if (raw) this.BenefitsDatas.push({ title: raw, description: '' });
      this.subscriptionForm.get('Benefits')?.reset();
    } else {
      const raw = (this.subscriptionForm.value.benefitContent || '').trim?.() ?? '';
      if (raw) this.OffersIncludes.push({ title: raw, icon: '', description: '' });
      this.subscriptionForm.get('benefitContent')?.reset();
    }
  }

  removeBenefits(index: number, kind: 'Benefits' | 'benefitContent'): void {
    if (kind === 'Benefits') {
      if (index > -1 && index < this.BenefitsDatas.length) this.BenefitsDatas.splice(index, 1);
    } else {
      if (index > -1 && index < this.OffersIncludes.length) this.OffersIncludes.splice(index, 1);
    }
  }


removeBannerAt(index: number) {
  const arr = [...(this.subscriptionFormControl['bannerImg'].value as string[])];
  arr.splice(index, 1);
  this.subscriptionFormControl['bannerImg'].setValue(arr);
  this.subscriptionFormControl['bannerImg'].markAsDirty();
}


  openModal(type: 'benefit' | 'offer', index: number | null = null) {
    this.modalType = type;
    this.editingIndex = index;

    if (type === 'benefit') {
      if (index !== null) {
        const b = this.BenefitsDatas[index];
        this.newBenefit = { title: b.title, description: b.description ?? '' };
        this.modalTitle = 'Edit Benefit';
      } else {
        this.newBenefit = { title: '', description: '' };
        this.modalTitle = 'Add Benefit';
      }
    } else {
      if (index !== null) {
        const o = this.OffersIncludes[index];
        this.newOffer = { icon: o.icon, title: o.title, description: o.description ?? '' };
        this.modalTitle = 'Edit Offer';
      } else {
        this.newOffer = { icon: '', title: '', description: '' };
        this.modalTitle = 'Add Offer';
      }
    }
  }

  saveModal() {
    if (this.modalType === 'benefit') {
      const t = (this.newBenefit.title || '').trim();
      const d = (this.newBenefit.description || '').trim();
      if (!t) return;

      if (this.editingIndex !== null) {
        this.BenefitsDatas[this.editingIndex] = { title: t, description: d };
      } else {
        this.BenefitsDatas.push({ title: t, description: d });
      }
    } else {
      const t = (this.newOffer.title || '').trim();
      const d = (this.newOffer.description || '').trim();
      const i = (this.newOffer.icon || '').trim();
      if (!t) return;

      const offer = { title: t, description: d, icon: i };
      if (this.editingIndex !== null) {
        this.OffersIncludes[this.editingIndex] = offer;
      } else {
        this.OffersIncludes.push(offer);
      }
    }


    this.editingIndex = null;
    this.modalType = 'benefit';
    this.modalTitle = 'Add Benefit';
    this.newBenefit = { title: '', description: '' };
    this.newOffer = { icon: '', title: '', description: '' };
  }
}
