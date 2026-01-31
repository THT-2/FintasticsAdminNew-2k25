import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Transaction } from './dashboard/transaction/transaction';
import { Budgeting } from './dashboard/budgeting/budgeting';
import { FinancialGoals } from './dashboard/financial-goals/financial-goals';
import { PaymentDetails } from './payment-and-finance/payment-details/payment-details';
import { PaymentList } from './payment-and-finance/payment-list/payment-list';
import { Bank } from './payment-and-finance/bank/bank';
import { Category } from './content-and-subscription/category/category';
import { Subcategory } from './content-and-subscription/subcategory/subcategory';
import { SubscriptionPlans } from './content-and-subscription/subscription-plans/subscription-plans';
import { Overview } from './overview/overview';
import { authguradGuard } from '../Service/authgurad-guard';
import { PaymentType } from './payment-and-finance/payment-type/payment-type';
import { CategoryCreateEdit } from './content-and-subscription/category/category-create-edit/category-create-edit';
import { SubCreateEdit } from './content-and-subscription/subcategory/sub-create-edit/sub-create-edit';
import { Push } from './notification/push/push';
import { Whatsapp } from './notification/whatsapp/whatsapp';
import { Sms } from './notification/sms/sms';
import { List } from './tool-suite/list/list';
import { CartCategory } from './shopping-cart/cart-category/cart-category';
import { Products } from './shopping-cart/products/products';
import { ListCreateEdit } from './tool-suite/list/list-create-edit/list-create-edit';
import { ProductsCreateEdit } from './shopping-cart/products/products-create-edit/products-create-edit';
import { CartCreateEdit } from './shopping-cart/cart-category/cart-create-edit/cart-create-edit';
import { PushCreateEdit } from './notification/push/push-create-edit/push-create-edit';
import { BankCreateEdit } from './payment-and-finance/bank/bank-create-edit/bank-create-edit';
import { PaytypeCreateEdit } from './payment-and-finance/payment-type/paytype-create-edit/paytype-create-edit';
import { SubscriptionCreateEdit } from './content-and-subscription/subscription-plans/subscription-create-edit/subscription-create-edit';
import { Level1 } from './chatbot/financial-chatbot/level1/level1';
import { Level2 } from './chatbot/financial-chatbot/level2/level2';
import { Level3 } from './chatbot/financial-chatbot/level3/level3';
import { Level4 } from './chatbot/financial-chatbot/level4/level4';
import { ChatDashboard } from './chatbot/main-menu/chat-dashboard/chat-dashboard';
import { AgentManagement } from './chatbot/main-menu/agent-management/agent-management';
import { ChatHistory } from './chatbot/main-menu/chat-history/chat-history';
import { Analytics } from './chatbot/main-menu/analytics/analytics';
import { RegisteredUsers } from './chatbot/user-categories/registered-users/registered-users';
import { RepeatUsers } from './chatbot/user-categories/repeat-users/repeat-users';
import { SubscribedUsers } from './chatbot/user-categories/subscribed-users/subscribed-users';
import { TaxFiling } from './chatbot/financial-topics/tax-filing/tax-filing';
import { Investment } from './chatbot/financial-topics/investment/investment';
import { TaxPlanning } from './chatbot/financial-topics/tax-planning/tax-planning';
import { WealthManagement } from './chatbot/financial-topics/wealth-management/wealth-management';
import { Level1CreateEdit } from './chatbot/financial-chatbot/level1/level1-create-edit/level1-create-edit';
import { Level2CreateEdit } from './chatbot/financial-chatbot/level2/level2-create-edit/level2-create-edit';
import { Level3CreateEdit } from './chatbot/financial-chatbot/level3/level3-create-edit/level3-create-edit';
import { Level4CreateEdit } from './chatbot/financial-chatbot/level4/level4-create-edit/level4-create-edit';
import { PerformanceHistory } from './chatbot/main-menu/performance-history/performance-history';
import { AppBanner } from './app-banner/app-banner';
import { AppBannerCreateEdit } from './app-banner/app-banner-create-edit/app-banner-create-edit';
import { SubscriptionUsers } from './subscription-users/subscription-users';
import { InviteUserList } from './invite-user-list/invite-user-list';
import { FamilyUserList } from './family-user-list/family-user-list';
import { RevenueInsights } from './revenue-insights/revenue-insights';
import { FinancialGoalsCat } from './financial-goals-cat/financial-goals-cat';
import { FingoalsCreateEdit } from './financial-goals-cat/fingoals-create-edit/fingoals-create-edit';
import { DuesRemainders } from './dues-remainders/dues-remainders';
import { DuesCreateEdit } from './dues-remainders/dues-create-edit/dues-create-edit';
import { Video } from './video/video';
import { VideoCreateEdit } from './video/video-create-edit/video-create-edit';
import { Storyboard } from './storyboard/storyboard';
import { StoryCreateEdit } from './storyboard/story-create-edit/story-create-edit';
import { CustomerSupport } from './customer-support/customer-support';
import { Role } from './role/role';
import { RoleCreateEdit } from './role/role-create-edit/role-create-edit';
import { UserDetails } from './user-details/user-details';
import { DetailsCreateEdit } from './user-details/details-create-edit/details-create-edit';
import { OnboardingQuestions } from './onboarding-questions/onboarding-questions';
import { OnboardCreateEdit } from './onboarding-questions/onboard-create-edit/onboard-create-edit';
import { Admin } from './admin/admin';
import { AdminCreateEdit } from './admin/admin-create-edit/admin-create-edit';
import { NewsUpdate } from './news-update/news-update';
import { UpdatesCreateEdit } from './news-update/updates-create-edit/updates-create-edit';
import { Hometronics } from './hometronics/hometronics';
import { HometronicsCreateEdit } from './hometronics/hometronics-create-edit/hometronics-create-edit';
import { SubscriptionFeatures } from './subscription-features/subscription-features';
import { SubsFeaturesCreateEdit } from './subscription-features/subs-features-create-edit/subs-features-create-edit';
import { BenifitsBannerCreateEdit } from './subscription-features/benifits-banner-create-edit/benifits-banner-create-edit';
import { Chats } from './chats/chats';
import { chatBlockGuard } from '../Service/chat-block-guard';
import { ChallengeDashboard } from './challenge-30-days/challenge-dashboard/challenge-dashboard';
import { AnalyticsDashboard } from './challenge-30-days/analytics-dashboard/analytics-dashboard';
import { ParticipantsDashboard } from './challenge-30-days/participants-dashboard/participants-dashboard';
import { RewardsDashboard } from './challenge-30-days/rewards-dashboard/rewards-dashboard';
import { UserActivityDashboard } from './challenge-30-days/user-activity-dashboard/user-activity-dashboard';
import { StartRedirect } from './start-redirect';
import { BadgeSettings } from './badge-settings/badge-settings';
import { BadgeCreateEdit } from './badge-settings/badge-create-edit/badge-create-edit';
import { User360ViewDashboard } from './user-details/user-360-view-dashboard/user-360-view-dashboard';
import { BlogDashboard } from './blogs/blog-dashboard/blog-dashboard';
import { AddPost } from './blogs/add-post/add-post';
import { BlogCategories } from './blogs/blog-categories/blog-categories';
import { BlogTags } from './blogs/blog-tags/blog-tags';
import { NewPost } from './blogs/new-post/new-post';
import { AdSettings } from './ad-settings/ad-settings';
import { AdSettingsCreateEdit } from './ad-settings/ad-settings-create-edit/ad-settings-create-edit';


const routes: Routes = [
{
  path: '',
  redirectTo: 'start',
  pathMatch: 'full',
},
{ path: 'start', component:StartRedirect ,canActivate:[authguradGuard]},

    {path: 'overview', component: Overview,canActivate:[authguradGuard]},
          {path:'transaction',
            children:[
              {path:'',component:Transaction}
            ]
          },
          {path:'budget',
            children:[
              {path:'',component:Budgeting}
            ]
          },
          {path:'financial-goals',
            children:[
              {path:'',component:FinancialGoals}
            ]
          },
          {path:'banners',
            children:[
              {path:'',component:AppBanner},
              {path:'create',component:AppBannerCreateEdit},
              {path:'edit/:id',component:AppBannerCreateEdit},
            ]
          },
          {path:'roles',
            children:[
              {path:'',component:Role},
              {path:'create', component:RoleCreateEdit},
              {path:'edit/:id', component:RoleCreateEdit},
            ]
          },
          {path:'user-details',
            children:[
              {path:'',component:UserDetails},
              {path:'create', component:DetailsCreateEdit},
              {path:'edit/:id', component:DetailsCreateEdit},
              // {path:'view-dashboard/:id',component:User360ViewDashboard}
            ]
          },
          {path:'view',component:User360ViewDashboard},

          {path:'subscription',
            children:[
              {path:'',component:SubscriptionUsers},
              {path:'create', component:SubscriptionCreateEdit},
              {path:'edit/:id', component:SubscriptionCreateEdit},
            ]
          },
          {path:'invite',
            children:[
              {path:'',component:InviteUserList}
            ]
          },
          {path:'family-user',
            children:[
              {path:'',component:FamilyUserList}
            ]
          },
          {path:'revenue',
            children:[
              {path:'',component:RevenueInsights}
            ]
          },
          {path:'questions',
            children:[
              {path:'',component:OnboardingQuestions},
              {path:'create',component:OnboardCreateEdit},
              {path:'edit/:id',component:OnboardCreateEdit}
            ]
          },
          {path:'adminuser',
            children:[
              {path:'',component:Admin},
              {path:'create',component:AdminCreateEdit},
              {path:'edit/:id',component:AdminCreateEdit}
            ]
          },
          {path:'goals',
            children:[
              {path:'',component:FinancialGoalsCat},
              {path:'create',component:FingoalsCreateEdit},
              {path:'edit/:id',component:FingoalsCreateEdit},
            ]
          },
          {path:'due-remainder',
            children:[
              {path:'',component:DuesRemainders},
              {path:'create',component:DuesCreateEdit},
              {path:'edit/:id',component:DuesCreateEdit},

            ]
          },
          {path:'video',
            children:[
              {path:'',component:Video},
              {path:'create',component:VideoCreateEdit},
              {path:'edit/:id',component:VideoCreateEdit},

            ]
          },
          {path:'storyboard',
            children:[
              {path:'',component:Storyboard},
              {path:'create',component:StoryCreateEdit},
              {path:'edit/:id',component:StoryCreateEdit},

            ]
          },
          {path:'customer-support',
            children:[
              {path:'',component:CustomerSupport},

            ]
          },
          {path:'push',
            children:[
              {path:'',component:Push},
              {path:'create',component:PushCreateEdit},
              {path:'edit/:id',component:PushCreateEdit},

            ]
          },
          {path:'whatsapp',
            children:[
              {path:'',component:Whatsapp},

            ]
          },
          {path:'sms',
            children:[
              {path:'',component:Sms},
            ]
          },
          {path:'list',
            children:[
              {path:'',component:List},
              {path:'create',component:ListCreateEdit},
              {path:'edit/:id',component:ListCreateEdit}
            ]
          },
          {path:'cart-cat',
            children:[
              {path:'',component:CartCategory},
              {path:'create',component:CartCreateEdit},
              {path:'edit/:id',component:CartCreateEdit}
            ]
          },
          {path:'products',
            children:[
              {path:'',component:Products},
              {path:'create',component:ProductsCreateEdit},
              {path:'edit/:id',component:ProductsCreateEdit}
            ]
          },
          {path:'challenge-dashboard',
            children:[
              {path:'',component:ChallengeDashboard},
            ]
          },
          {path:'analytics-dashboard',
            children:[
              {path:'',component:AnalyticsDashboard}
            ]
          },
          {path:'participant-dashboard',
            children:[
              {path:'',component:ParticipantsDashboard}
            ]
          },
          {path:'rewards-dashboard',
            children:[
              {path:'',component:RewardsDashboard}
            ]
          },
          {path:'user-activity-dashboard/:id',
            children:[
              {path:'',component:UserActivityDashboard}
            ]
          },
          {path:'payment-details',
            children:[
              {path:'',component:PaymentDetails}
            ]
          },
          {path:'payment-list',
            children:[
              {path:'',component:PaymentList}
            ]
          },
          {path:'payment-type-list',
            children:[
              {path:'',component:PaymentType},
              {path:'create',component:PaytypeCreateEdit},
              {path:'edit/:id',component:PaytypeCreateEdit}
            ]
          },
          {path:'bank',
            children:[
              {path:'',component:Bank},
              {path:'create',component:BankCreateEdit},
              {path:'edit/:id',component:BankCreateEdit}
            ]
          },
          { path: 'chat', component: ChatDashboard},
          // { path: 'level1/create', component: CreateEditLevel1Component },
          // { path: 'level1/edit/:id', component: CreateEditLevel1Component },

          { path: 'agent', component: AgentManagement },
          // { path: 'level2/create', component: CreateEditLevel2Component },
          // { path: 'level2/edit/:id', component: CreateEditLevel2Component },

          { path: 'history', component:ChatHistory},
          { path: 'chats', component:Chats, canDeactivate: [chatBlockGuard],},
          // {path:':id',component:ChatRight},
          // { path: 'level3/create', component: CreateEditLevel3Component },
          // { path: 'level3/edit/:id', component: CreateEditLevel3Component },
          { path: 'performance', component: PerformanceHistory },
          // { path: 'level3/create', component: CreateEditLevel3Component },
          // { path: 'level3/edit/:id', component: CreateEditLevel3Component },

          { path: 'analytics', component: Analytics },
          // { path: 'level4/create', component: CreateEditLevel4Component },
          // { path: 'level4/edit/:id', component: CreateEditLevel4Component }
          // { path: 'registered', component: RegisteredUsers },
          // { path: 'registered', component: RegisteredUsers },
          { path: 'registered', component: RegisteredUsers },
          // { path: 'level1/create', component: CreateEditLevel1Component },
          // { path: 'level1/edit/:id', component: CreateEditLevel1Component },

          { path: 'subscribed',
            children:[
              {path:'',component:SubscribedUsers},
              {path:'create',component:SubscribedUsers},
              {path:'edit/:id',component:SubscribedUsers}
            ]
           },
          // { path: 'level2/create', component: CreateEditLevel2Component },
          // { path: 'level2/edit/:id', component: CreateEditLevel2Component },

          { path: 'repeat', component: RepeatUsers },
          // { path: 'level3/create', component: CreateEditLevel3Component },
          // { path: 'level3/edit/:id', component: CreateEditLevel3Component },

          { path: 'tax', component: TaxFiling },
          // { path: 'level1/create', component: CreateEditLevel1Component },
          // { path: 'level1/edit/:id', component: CreateEditLevel1Component },

          { path: 'invest', component: Investment },
          // { path: 'level2/create', component: CreateEditLevel2Component },
          // { path: 'level2/edit/:id', component: CreateEditLevel2Component },

          { path: 'tax-paln', component: TaxPlanning },
          // { path: 'level3/create', component: CreateEditLevel3Component },
          // { path: 'level3/edit/:id', component: CreateEditLevel3Component },

          { path: 'wealth', component: WealthManagement },
          // { path: 'level4/create', component: CreateEditLevel4Component },
          // { path: 'level4/edit/:id', component: CreateEditLevel4Component }

          { path: 'level1', component: Level1 },
          { path: 'level1/create', component: Level1CreateEdit },
          { path: 'level1/edit/:id', component: Level1CreateEdit },

          { path: 'level2', component: Level2 },
          { path: 'level2/create', component: Level2CreateEdit },
          { path: 'level2/edit/:id', component: Level2CreateEdit },

          { path: 'level3', component: Level3 },
          { path: 'level3/create', component: Level3CreateEdit },
          { path: 'level3/edit/:id', component: Level3CreateEdit },

          { path: 'level4', component: Level4 },
          { path: 'level4/create', component: Level4CreateEdit },
          { path: 'level4/edit/:id', component: Level4CreateEdit },

          {path: 'blog-dashboard',component:BlogDashboard},
          {path: 'new-post',component:NewPost},
          {path: 'add-post',component:AddPost},
          {path: 'blog-categories',component:BlogCategories},
          {path: 'tags',component:BlogTags},

          {path:'category',
            children:[
              {path:'',component:Category},
              {path: 'create', component: CategoryCreateEdit},
              {path: 'edit/:id', component: CategoryCreateEdit},
            ]
          },
          {path:'subcategory',
            children:[
              {path:'',component:Subcategory},
              {path:'create',component:SubCreateEdit},
              {path:'edit/:id',component:SubCreateEdit}
            ]
          },
          {path:'plans',
            children:[
              {path:'',component:SubscriptionPlans},
              {path:'create',component:SubscriptionCreateEdit},
              {path:'edit/:id',component:SubscriptionCreateEdit}
            ]
          },
          {path:'features',
            children:[
              {path:'',component:SubscriptionFeatures},
              {path:'create',component:SubsFeaturesCreateEdit},
              {path:'edit/:id',component:SubsFeaturesCreateEdit},
              {path:'benefits/create',component:BenifitsBannerCreateEdit},
              {path:'benefits/edit/:id',component:BenifitsBannerCreateEdit}
            ]
          },

          {path:'news-update',
            children:[
              {path:'',component:NewsUpdate},
              {path:'create',component:UpdatesCreateEdit},
              {path:'edit/:id',component:UpdatesCreateEdit}
            ]
          },
          {path:'hometronics',
            children:[
              {path:'',component:Hometronics},
              {path:'create',component:HometronicsCreateEdit},
              {path:'edit/:id',component:HometronicsCreateEdit},
            ]
          },
          {
            path:'badge-settings',
            children:[
              {path:'',component:BadgeSettings},
              {path:'create',component:BadgeCreateEdit},
              {path:'edit/:id',component:BadgeCreateEdit},

            ]
          },
          {
            path:'ad-settings',
            children:[
              {path:'',component:AdSettings},
              {path:'create',component:AdSettingsCreateEdit},
              {path:'edit/:id',component:AdSettingsCreateEdit},

            ]
          },
    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
