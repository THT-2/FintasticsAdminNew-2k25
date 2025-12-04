import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '../../../Service/data';
import { AlertService } from '../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../constants/api-route-constants';
import { GlobalConstant } from '../../../constants/global-constants';
import { Card } from '../../../Z-Commons/card/card';

@Component({
  selector: 'app-role-create-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Card],
  templateUrl: './role-create-edit.html',
  styleUrl: './role-create-edit.scss',
  providers:[AlertService]
})
export class RoleCreateEdit implements OnInit {

  roleForm!: FormGroup;
  roleType: string = '';
  editAccess!: boolean;
  viewAccess!: boolean;
  pageLoader!: boolean;
  roleData: any;
  menuSidebar: any;
  editId: any;
  GlobalConstant: any = GlobalConstant;

NavItems: any[]=[
  {
    id: 'dashboard',
    title: 'Dashboard',
    status: false,
    checked: false,
    color:'#6A4C93',
    subtitle: [
      {
        id: 'overview',
        title: 'Overview',
        icon: 'fas fa-tachometer-alt',
        status: false,
        checked: false,
        path: '/admin/overview',
      },
      {
        id: 'transaction',
        title: 'Transaction',
        icon: 'fas fa-exchange-alt',
        status: false,
        checked: false,
        path: '/admin/transaction'
      },
      {
        id: 'budgeting',
        title: 'Budgeting',
        icon: 'fas fa-wallet',
        status: false,
        checked: false,
        path: '/admin/budget'
      },
      {
        id: 'financial-goals',
        title: 'Financial-Goals',
        icon: 'fas fa-bullseye',
        status: false,
        checked: false,
        path: '/admin/financial-goals'
      },
      {
        id: 'banners',
        title: 'App-Banners',
        icon: 'fas fa-bullseye',
        status: false,
        checked: false,
        path: '/admin/banners'
      },
    ],
    icon: '',
    path: ''
  },
  {
    id: 'user-role',
    title: 'User Roles',
    status: false,
    checked: false,
    color:'#00897B',
    subtitle: [
      {
        id: 'role',
        title: 'Roles',
        icon: 'fas fa-user-shield',
        status: false,
        checked: false,
        path: '/admin/roles'
      },
      {
        id: 'details',
        title: 'User Details',
        icon: 'fas fa-user',
        status: false,
        checked: false,
        path: '/admin/user-details'
      },
      {
        id: 'subscription',
        title: 'Subscription Users',
        icon: 'fas fa-users',
        status: false,
        checked: false,
        path: '/admin/subscription'
      },
      {
        id: 'invite',
        title: 'Invite User List',
        icon: 'fas fa-user-plus',
        status: false,
        checked: false,
        path: '/admin/invite'
      },
      {
        id: 'family-list',
        title: 'Family User List',
        icon: 'fas fa-users-cog',
        status: false,
        checked: false,
        path: '/admin/family-user'
      },
    ],
    icon: '',
    path: ''
  },
  {
    id: 'challenge',
    title: '30 Days Challenge',
    status: false,
    checked: false,
    color:'#00897B',
    subtitle: [
      {
        id: 'challenge-dash',
        title: 'Challenge Dashboard',
        icon: 'fas fa-user-shield',
        status: false,
        checked: false,
        path: '/admin/challenge-dashboard'
      },
      {
        id: 'analytics-dash',
        title: 'Analytics Dashboard',
        icon: 'fas fa-user',
        status: false,
        checked: false,
        path: '/admin/analytics-dashboard'
      },
      {
        id: 'participants-dash',
        title: 'Participants Dashboard',
        icon: 'fas fa-users',
        status: false,
        checked: false,
        path: '/admin/participant-dashboard'
      },
      {
        id: 'rewards-dash',
        title: 'Rewards Dashboard',
        icon: 'fas fa-user-plus',
        status: false,
        checked: false,
        path: '/admin/rewards-dashboard'
      },
    ],
    icon: '',
    path: ''
  },
  {
    id: 'subscribe',
    title: 'Subscriptions',
    status: false,
    checked: false,
    color:'#FF9800',
    subtitle: [
      {
        id: 'revenue',
        title: 'Revenue Insights',
        icon: 'fas fa-chart-line',
        status: false,
        checked: false,
        path: '/admin/revenue'
      },
       {
        id: 'subscribed',
        title: 'Subscribed Users',
        icon: 'fas fa-user-clock',
        status: false,
        checked: false,
        path: '/admin/subscribed'
      },
    ],
    icon: '',
    path: ''
  },
   {
    id: 'chatbot',
    title: 'Financial ChatBots',
    status: false,
    checked: false,
    color:'#0097A7',
    subtitle: [
      {
        id: 'level1',
        title: 'Level 1',
        icon: 'fas fa-layer-group',
        status: false,
        checked: false,
        path: '/admin/level1'
      },
      {
        id: 'level2',
        title: 'Level 2',
        icon: 'fas fa-cubes',
        status: false,
        checked: false,
        path: '/admin/level2'
      },
      {
        id: 'level3',
        title: 'Level 3',
        icon: 'fas fa-network-wired',
        status: false,
        checked: false,
        path: '/admin/level3'
      },
      {
        id: 'level4',
        title: 'Level 4',
        icon: 'fas fa-project-diagram',
        status: false,
        checked: false,
        path: '/admin/level4'
      },
    ],
    icon: '',
    path: ''
  },
    {
    id: 'mainmenu',
    title: 'Fin Expert Chat',
    status: false,
    checked: false,
    color:'#3F51B5',
    subtitle: [
      {
        id: 'chat',
        title: 'Chat Dashboard',
        icon: 'fas fa-comments',
        status: false,
        checked: false,
        path: '/admin/chat'
      },
      {
        id: 'agent',
        title: 'Agent Management',
        icon: 'fas fa-user-tie',
        status: false,
        checked: false,
        path: '/admin/agent'
      },
      // {
      //   id: 'chats',
      //   title: 'Chat',
      //   icon: 'fas fa-history',
      //   status: false,
      //   checked: false,
      //   path: '/admin/chats'
      // },
      {
        id: 'performance',
        title: 'Performace History',
        icon: 'fas fa-tasks',
        status: false,
        checked: false,
        path: '/admin/performance'
      },
      {
            id: 'analytics',
            title: 'Analytics',
            icon: 'fas fa-chart-pie',
            status: false,
            checked: false,
            path: '/admin/analytics',
          }
    ],
    icon: '',
    path: ''
  },
    {
    id: 'user-cats',
    title: 'User Categorties',
    status: false,
    checked: false,
    color:'#795548',
    subtitle: [
      {
        id: 'user-dash',
        title: 'User Dashboard',
        icon: 'fas fa-gauge',
        status: false,
        checked: false,
        path: '/admin/registered'
      },
      {
        id: 'registered',
        title: 'Registered Users',
        icon: 'fas fa-user-check',
        status: false,
        checked: false,
        path: '/admin/registered'
      },
      {
        id: 'repeat',
        title: 'Repeat Users',
        icon: 'fas fa-user-friends',
        status: false,
        checked: false,
        path: '/admin/repeat'
      },
      {
        id: 'ticket',
        title: 'Fin Ticket Details',
        icon: 'fas fa-file-invoice-dollar',
        status: false,
        checked: false,
        path: '/admin/repeat'
      },
      {
        id: 'cs',
        title: 'Customer Support',
        icon: 'fas fa-headset',
        status: false,
        checked: false,
        path: '/admin/repeat'
      },
    ],
    icon: '',
    path: ''
  },
    {
    id: 'fin-topics',
    title: 'Financial Topics',
    status: false,
    checked: false,
    color:'#4CAF50',
    subtitle: [
      {
        id: 'tax',
        title: 'Tax Filing',
        icon: 'fas fa-file-invoice',
        status: false,
        checked: false,
        path: '/admin/tax'
      },
      {
        id: 'invest',
        title: 'Investments',
        icon: 'fas fa-coins',
        status: false,
        checked: false,
        path: '/admin/invest'
      },
      {
        id: 'tax-paln',
        title: 'Tax Planning',
        icon: 'fas fa-calculator',
        status: false,
        checked: false,
        path: '/admin/tax-paln'
      },
      {
        id: 'wealth',
        title: 'Wealth Management',
        icon: 'fas fa-piggy-bank',
        status: false,
        checked: false,
        path: '/admin/wealth'
      },
    ],
    icon: '',
    path: ''
  },

  {
    id: 'onboarding',
    title: 'Onboarding',
    status: false,
    checked: false,
    color:'#5C6BC0',
    subtitle: [
      {
        id: 'questions',
        title: 'Onboarding Questions',
        icon: 'fas fa-question-circle',
        status: false,
        checked: false,
        path: '/admin/questions'
      },
      {
        id: 'adminuser',
        title: 'Admin',
        icon: 'fas fa-user-shield',
        status: false,
        checked: false,
        path: '/admin/adminuser'
      },
    ],
    icon: '',
    path: ''
  },
  {
    id: 'payment-finance',
    title: 'Payment and Finance',
    status: false,
    checked: false,
    color:'#F4511E',
    subtitle: [
      {
        id: 'payment-details',
        title: 'Payment Details',
        icon: 'fas fa-receipt',
        status: false,
        checked: false,
        path: '/admin/payment-details'
      },
      {
        id: 'payment-list',
        title: 'Payment List',
        icon: 'fas fa-list-alt',
        status: false,
        checked: false,
        path: '/admin/payment-list'
      },
      {
        id: 'payment-type-list',
        title: 'Payment Type List',
        icon: 'fas fa-money-check-alt',
        status: false,
        checked: false,
        path: '/admin/payment-type-list'
      },
      {
        id: 'bank',
        title: 'Bank',
        icon: 'fas fa-university',
        status: false,
        checked: false,
        path: '/admin/bank'
      },
    ],
    icon: '',
    path: ''
  },
  {
    id: 'others',
    title: 'Others',
    status: false,
    checked: false,
    color:'#9C27B0',
    subtitle: [
      {
        id: 'financial-goals-cat',
        title: 'Financial Goal Category',
        icon: 'fas fa-tasks',
        status: false,
        checked: false,
        path: '/admin/goals'
      },
      {
        id: 'due-remainder',
        title: 'Dues and Remainders',
        icon: 'fas fa-calendar-check',
        status: false,
        checked: false,
        path: '/admin/due-remainder'
      },
      {
        id: 'video',
        title: 'Videos',
        icon: 'fas fa-video',
        status: false,
        checked: false,
        path: '/admin/video'
      },
      {
        id: 'storyboard',
        title: 'Story Board',
        icon: 'fas fa-photo-video',
        status: false,
        checked: false,
        path: '/admin/storyboard'
      },
      {
        id: 'customer-support',
        title: 'Customer Support',
        icon: 'fas fa-headset',
        status: false,
        checked: false,
        path: '/admin/customer-support'
      },
    ],
    icon: '',
    path: ''
  },
    {
    id: 'notify',
    title: 'Notifications',
    status: false,
    checked: false,
    color:'#00BCD4',
    subtitle: [
      {
        id: 'push',
        title: 'Push Notification',
        icon: 'fas fa-bell',
        status: false,
        checked: false,
        path: '/admin/push'
      },
      {
        id: 'whatsapp',
        title: 'Whatsapp Notification',
        icon: 'fa-brands fa-whatsapp',
        status: false,
        checked: false,
        path: '/admin/whatsapp'
      },
      {
        id: 'sms',
        title: 'SMS Notification',
        icon: 'fas fa-comment-alt',
        status: false,
        checked: false,
        path: '/admin/sms'
      },
    ],
    icon: '',
    path: ''
  },
    {
    id: 'tools',
    title: 'Tool-Suites',
    status: false,
    checked: false,
    color:'#607D8B',
    subtitle: [
      {
        id: 'list',
        title: 'Tools',
        icon: 'fas fa-tools',
        status: false,
        checked: false,
        path: '/admin/list'
      },
    ],
    icon: '',
    path: ''
  },
    {
    id: 'cart',
    title: 'Shopping Cart',
    status: false,
    checked: false,
    color:'#E91E63',
    subtitle: [
      {
        id: 'cart-cat',
        title: 'Cart Categories',
        icon: 'fas fa-tags',
        status: false,
        checked: false,
        path: '/admin/cart-cat'
      },
      {
        id: 'products',
        title: 'Products',
        icon: 'fas fa-box',
        status: false,
        checked: false,
        path: '/admin/products'
      },
    ],
    icon: '',
    path: ''
  },

  {
    id: 'content-subsciption',
    title: 'Content & Subscriptions',
    status: false,
    checked: false,
    color:'#FF5722',
    subtitle: [
      {
        id: 'category',
        title: 'Category',
        icon: 'fas fa-folder',
        status: false,
        checked: false,
        path: '/admin/category'
      },
      {
        id: 'sub',
        title: 'Sub-Category',
        icon: 'fas fa-folder-open',
        status: false,
        checked: false,
        path: '/admin/subcategory'
      },
      {
        id: 'plans',
        title: 'Subscription Plans',
        icon: 'fas fa-star',
        status: false,
        checked: false,
        path: '/admin/plans'
      },
      {
        id: 'features',
        title: 'Subscription Features',
        icon: 'fas fa-star',
        status: false,
        checked: false,
        path: '/admin/features'
      },
    ],
    icon: '',
    path: ''
  },
  {
    id: 'news-media',
    title: 'News & Media',
    status: false,
    checked: false,
    color:'#3F51B5',
    subtitle: [
      {
        id: 'update',
        title: 'News Updates',
        icon: 'fas fa-newspaper',
        status: false,
        checked: false,
        path: '/admin/news-update'
      },
      {
        id: 'hometronics',
        title: 'Hometronics',
        icon: 'fas fa-home',
        status: false,
        checked: false,
        path: '/admin/hometronics'
      },
    ],
    icon: '',
    path: ''
  },
]

constructor(private navService: Data,private alertService:AlertService,private formbuild: FormBuilder, private router:Router, private acRouter:ActivatedRoute) {
  console.log("nav",this.NavItems);
      this.roleForm = this.formbuild.group({
      roleType: ['', Validators.required],
      _id: [null]
    });
  }


  ngOnInit(): void {
  // this.NavItems = this.navService.NavItems();
  console.log("newnavItems", this.NavItems);

  this.acRouter.paramMap.subscribe((param) => {
    const id = String(param.get('id'));
    if (id && id !== 'null') {
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

  get roleFormControl () {
    return this.roleForm.controls;

  }

getById(id: any) {
  this.pageLoader = true;
  const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Roles_get_id + id;

  this.navService.getData(apiUrl).subscribe({
    next: (res: any) => {
      this.roleData = res.data;

      this.roleForm.patchValue({
        roleType: this.roleData.title,
        _id: this.roleData._id
      });

      const mergedNavItems: any[] = [];

      // Merge with current NavItems structure
      for (let i = 0; i < this.NavItems.length; i++) {
        const parent = this.NavItems[i];
        const matchedParent = this.roleData.permissions.find((p: any) => p.id === parent.id);

        const mergedParent: any = {
          id: parent.id,
          title: parent.title,
          color: parent.color,
          icon: parent.icon,
          path: parent.path,
          checked: matchedParent ? matchedParent.checked : parent.checked,
          subtitle: []
        };

        // Only include subtitles that still exist in current NavItems
        for (let j = 0; j < (parent.subtitle || []).length; j++) {
          const sub = parent.subtitle[j];
          const matchedSub = matchedParent?.subtitle?.find((s: any) => s.id === sub.id);

          mergedParent.subtitle.push({
            id: sub.id,
            title: sub.title,
            icon: sub.icon,
            path: sub.path,
            checked: matchedSub ? matchedSub.checked : sub.checked
          });
        }

        mergedNavItems.push(mergedParent);
      }

      //  Add any new parent from API that doesn't exist locally
      for (let i = 0; i < this.roleData.permissions.length; i++) {
        const apiParent = this.roleData.permissions[i];
        const exists = mergedNavItems.some((p: any) => p.id === apiParent.id);
        if (!exists) {
          mergedNavItems.push({ ...apiParent });
        }
      }

      // Update final NavItems list
      this.NavItems = [...mergedNavItems];

      this.editId = this.roleData._id;
      this.pageLoader = false;
    },
    error: () => {
      this.pageLoader = false;
    }
  });
}

  submit() {
  if (this.roleForm.valid) {
    const role_data = {
      title: this.roleForm.value.roleType,
      permissions: this.NavItems
    };

    if (this.roleFormControl['_id'].value) {

      const updateData = {
        ...role_data,
        _id: this.roleFormControl['_id'].value
      };
      const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Roles_edit;

      this.navService.postData(apiUrl, updateData).subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            console.log('editrole', res);
            this.alertService.toast("success", true, res.message);
            this.router.navigate(['/admin/roles']);
          } else {
            this.alertService.toast("error", true, res.message);
          }
        },
        error: (error: any) => {
          console.error(error);
          this.alertService.toast("error", true, "Something went wrong while updating role.");
        }
      });

    } else {

      const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Roles_create;

      this.navService.postData(apiUrl, role_data).subscribe({
        next: (res: any) => {
          if (res.code === 200) {
            this.alertService.toast("success", true, res.message);
            this.router.navigate(['/admin/roles']);
          } else {
            this.alertService.toast("error", true, res.message);
          }
        },
        error: (error: any) => {
          console.error(error);
          this.alertService.toast("error", true, "Something went wrong while creating role.");
        }
      });
    }

  } else {
    this.roleForm.markAllAsTouched();
  }
}

toggleSelectAll(item: any): void {
  const allSelected = this.areAllSubtitlesChecked(item);
  item.subtitle.forEach((sub: any) => (sub.checked = !allSelected));
}

areAllSubtitlesChecked(item: any): boolean {
  return item.subtitle.every((sub: any) => sub.checked);
}


}

