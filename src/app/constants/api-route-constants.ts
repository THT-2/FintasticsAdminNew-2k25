import { baseUrl, socket_baseUrl } from "./BaseUrls";

export class ApiRoutesConstants {

  // service constants urls
  public static BASE_URL = baseUrl;
  public static SOCKET_URL=socket_baseUrl;
  public static UPLOAD:string = "upload_admin";

  // dashboardUrl
  public static SubscriptionPlans = "adminPanel/payment_details"
  public static SubscriptionUsers = "adminPanel/transactionOverview"
  public static overviewcards="adminPanel/overview"


  // roles urls
  public static Roles_Type = 'roles/getlist';
  public static Roles_create = 'roles/create';
  public static Roles_edit = 'roles/edit';
  public static Roles_delete = 'roles/delete/';
  public static Roles_get_id = 'roles/getlist_id/';

  //admin Urls
  public static admin_create = 'admin/create';
  public static admin_edit = 'admin/edit';
  public static admin_getlist = 'admin/getlist';
  public static admin_getlist_id = 'admin/getlist_id';
  public static login = 'admin/authenticate';
  public static admin_delete = 'admin/delete';


  //users urls
  public static user_get_mob = 'userdetails/get_mob';
  public static user_create = 'userdetails/create';
  public static user_edit = 'userdetails/update';
  public static User_list = 'userdetails/getlist';
  public static InviteUser_list = 'group/inviteUser_list';
  public static familyUser_list = 'userdetails/familyUser_list';

  //paments type urls
  public static payment_type_getlist = 'payment_type/getlist';
  public static PAYMENT_TYPE = 'payment_type';
  public static CATEGORY ='recurringCatagory'
  public static payment_getlist = 'subscription/payment_details';

  // financial goals urls
  public static goals_type = 'financialgoalcategory';
  public static financial_goals_getlist = 'financialgoalcategory/getlist';
  public static financial_goals_getlist_byid = 'financialgoalcategory/getlist_id';
  public static financial_goals_create = 'financialgoalcategory/create';
  public static financial_goals_edit = 'financialgoalcategory/edit';

  // dues and remainders urls
  public static dues_and_remainders = 'dueandremaindersCategory';
  public static dues_and_remainders_getlist = 'dueandremaindersCategory/getlist/all';
  public static dues_and_remainders_getlist_id = 'dueandremaindersCategory/getlist_id';
  public static dues_and_remainders_create = 'dueandremaindersCategory/create';
  public static dues_and_remainders_edit = 'dueandremaindersCategory/edit';

  // categories urls
  public static desc_type_getlist = "desc_type/getlist";
  public static DESC_TYPE = "desc_type";

  // sub categories urls
  public static sub_desc_type_getlist = "sub_desc_type/getlist_sub_desc";
  public static SUB_DESC_TYPE = "sub_desc_type"

  // subscription plans urls
  public static subscription_getlist = "subscription/getlist";
  public static SUBSCRIPTION = "subscription";
  public static ProductId = "appStoreConnect/appstoreconnect";


  //subscription features urls
  public static features_getlist="subscription/subscription_features/get"
  public static features_getlist_ById="subscription/subscription_features/getById"
  public static features_create="subscription/subscription_features"
  public static features_edit="subscription/subscription_features/edit"
  public static features_delete="subscription/subscription_features/delete"
  public static features_update="subscription/subscription_features/update"


  //Benifit banner urls
  public static benefits_getlist="subscription/subscription_features/benefitImg"
  public static benefits_getlist_ById="subscription/subscription_features/benefitImg/getById"
  public static benefits_create="subscription/subscription_features/benefitImg"
  public static benefits_edit="subscription/subscription_features/benefitImg"
  public static benefits_delete="subscription/subscription_features/benefitImg"


  // News urls
  public static newscroll_getlist = "newscroll/getlist";
  public static NEWS_SCROLL = "newscroll";
  public static NEWS_SCROLL_create = "newscroll/create";
  public static NEWS_SCROLL_edit = "newscroll/edit";

  // Hometonics
  public static hometronics_getlist = "recurringCatagory/getlist";
  public static HOME_TONICS = "recurringCatagory";

  // Banners urls
  public static Banners_getlist = "banner/getlist";
  public static Banners_getbyId = "banner/getbyId";
  public static Banners_create = "banner/create";
  public static Banners_edit = "banner/edit";
  public static Banners_delete = "banner/delete";

  // sub categories urls
  public static videos_getlist = "videosUpload/getlist_Admin"
  public static VIDEO_UPLOAD = "videosUpload"

  // Notfication urls
  public static pushNotfication = "notification/send_alert"
  public static wtsappNotfication = "whatsappchat/send_wtsapp_notfication"
  public static pushNotficationcreate = "pushNotfication/create"
  public static pushNotficationgetlist = "pushNotfication/getlist"
  public static pushNotficationedit = "pushNotfication/edit"
  public static pushNotficationgetlist_id = "pushNotfication/getlist_id"
  public static pushnotification_instant = "pushNotfication/notification_instant"
  public static pushnotification_delete = "pushNotfication/delete/"

  // shoppingcartCategory urls
  public static shoppingcartCategory = "shoppingcartCategory";
  public static shoppingcartCategoryCreate = "shoppingcartCategory/create"
  public static shoppingcartCategorygetlist = "shoppingcartCategory/getlist"
  public static shoppingcartCategorygetlist_id = "shoppingcartCategory/getlist_id"

  // shoppingcartproducts
  public static shoppingcartproducts = "shoppingcart";
  public static shoppingcartproductsCreate = "shoppingcart/create"
  public static shoppingcartproductsgetlist = "shoppingcart/getlistAll"
  public static shoppingcartproductsgetlist_id = "shoppingcart/getlist_id"

  //financialbotchat/getlist
  public static financialbotchatgetlist = "financialbotchat/getlist"
  public static financialbotchatcreate = "financialbotchat/create"
  public static financialbotchatgetlist_id = "financialbotchat/getlist_id"
  public static financialbotchatgetlistlevel_id = "financialbotchat/getlistlevel_id"
  public static financialbotchatedit = "financialbotchat/edit"
  public static financialbotchatdelete = "financialbotchat/delete"

  //bank
  public static banklist = "banks/getlist"
  public static bankcreate= "banks/create"
  public static bankedit= "banks/edit"
  public static bankdelete= "banks/delete"
  public static bankgetlist_id= "banks/getlist_id"

  // StoryBoard
  public static StoryBoardCreate = "storyboard/create"
  public static StoryBoardEdit = "storyboard/edit"
  public static StoryBoardGetlistID = "storyboard/getlist"
  public static StoryBoardGetlistAll= "storyboard/getlist"
  public static StoryBoardDelete= "storyboard/delete"

  // Support
  public static supportTeam_getlist_admin = "supportTeam/getlist_admin"
  public static supportTeam_support_team_reply = "supportTeam/support_team_reply"
  public static supportTeam_admin_chat_list = "supportTeam/admin_chat_list"

  // ToolsSuites
  public static toolsuites = "toolsuites";
  public static ToolsSuites_create = "toolsuites/create"
  public static ToolsSuites_getlistAll= "toolsuites/getlistAll"
  public static ToolsSuites_getlist_id= "toolsuites/getlist_id"
  public static tools_delete = "toolsuites/delete"

  // OnBoardingAdmin
  public static OnBoardingQuestions_create = "onboardqusAdmin/create"
  public static OnBoardingQuestions_getlistAll= "onboardqusAdmin/getlist"
  public static OnBoardingQuestions_getlist_id= "onboardqusAdmin/getlist_id"
  public static OnBoardingQuestions_delete = "onboardqusAdmin/delete/"
  public static OnBoardingQuestionsEdit = "onboardqusAdmin/edit"

  // File Upload
  public static uploadfile = "upload_admin";

  // Dashboard
  public static Dashboard = "dashboard_details/admin_dashboard";
  public static UserForecast = "userdetails/getlist_user_prediction";

  //Fin-expert Chats
  public static chatlist= "finexpertchatBot/admin/chats/list";

  public static agentchatlist= "finexpertchatBot/agents/me/chats/list";
  public static userchats= "finexpertchatBot/users";
  public static AgentReply= "finexpertchatBot/tickets";
  public static activeStatus= "finexpertchatBot/admin/active_status/";

  //Fin-expert Chat Dashboard
  public static dashboard_cards="adminPanel/finexpertChatDashboard";

  //30-days challenge dashboard
  public static participantdata = "adminPanel/userdetails_Dashboard";
  public static challenge_dashboard = "adminPanel/challengeDashboard";


  //Badge Settings
  public static badgelist = "rewardsBadges/getlist";
  public static badgelist_create = "rewardsBadges/create";
  public static badgelist_edit = "rewardsBadges/edit";
  public static badgelist_delete = "rewardsBadges/delete";
  public static badgelist_byId = "rewardsBadges/getById";
  

  //Ad Settings
  public static ad_getlist = "googleads/getlist_admin";
  public static adcreate = "googleads/create";
  public static adlist_getbyid = "googleads/getlist_id";
  public static adlist_edit = "googleads/edit";


  // Common routes
  public static GET_LIST = "/getlist";
  public static EDIT = "/edit";
  public static CREATE = "/create";
  public static GET_LIST_ID = "/getlist_id";
  public static DELETE = "/delete";

}
