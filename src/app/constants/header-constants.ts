import { SubscribedUsers } from '../home/chatbot/user-categories/subscribed-users/subscribed-users';
export class HeaderConstants {

  public static userListHeader = [
    {
      'name': 'username',
      'displayName': 'Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'user_email',
      'displayName': 'Email',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'mobile_num',
      'displayName': 'Mobile Number',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'role',
      'displayName': 'Role',
      'disableSorting': false,
      'class': "text-transform"

    },
    {
      'name': 'createdAt',
      'displayName': 'Created Date',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': true,
    },
  ]

  public static adminListHeader = [
    {
      'name': 'userRole',
      'displayName': 'Role',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'userName',
      'displayName': 'User Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'userMail',
      'displayName': 'Email',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'userID',
      'displayName': 'User ID',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]
  public static roleListHeader = [
    {
      'name': 'title',
      'displayName': 'Role',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'delete_status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]
  public static BannersHeader = [
    {
      'name': 'title',
      'displayName': 'Title',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'page_name',
      'displayName': 'Page Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]
  public static ChallengeHeader = [
    {
      'name': 'username',
      'displayName': 'Participant',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'day',
      'displayName': 'Day',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'dailyLimit',
      'displayName': 'Daily-Limit',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'todaySpent',
      'displayName': 'Todays Spend',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'mobile_type',
      'displayName': 'Platform',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'mobile_num',
      'displayName': 'Mobile Number',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'startDate',
      'displayName': 'Join Date',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static paymentTypeListHeader = [
    {
      'name': 'payment_type',
      'displayName': 'Payment type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'icon',
      'displayName': 'Icon',
      'disableSorting': false,
      'class': "text-transform"
    },

    {
      'name': 'delete_status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static  financialGoalsCategoryHeader = [

      {
        'name':'icon',
        'displayName': 'Icon',
        'disableSorting': false,
        'class': "text-transform"
        },
    {
      'name':'catagory_type',
      'displayName': 'Category Type',
      'disableSorting': false,
      'class': "text-transform"
      },
    {
      'name':'delete_status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
      },
      {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static  duesandremainderCategoryHeader = [

      {
        'name':'icon',
        'displayName': 'Icon',
        'disableSorting': false,
        'class': "text-transform"
        },
    {
      'name':'catagory_type',
      'displayName': 'Category Type',
      'disableSorting': false,
      'class': "text-transform"
      },
    {
      'name':'billdues_way',
      'displayName': 'Income',
      'disableSorting': false,
      'class': "text-transform"
      },
      {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },

  ]

  public static descTypeListHeader = [
    {
      'name': 'desc_type',
      'displayName': 'Category Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'icon',
      'displayName': 'Icon',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'colorCode',
      'displayName': 'Color Code',
      'disableSorting': false,
      'class': "text-transform"
    },
      {
      'name': 'budgetpersentage',
      'displayName': 'Budget Percentage',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'delete_status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static SubdescTypeListHeader = [
    {
      'name': 'desc_type',
      'displayName': 'Category Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'sub_desc_type',
      'displayName': 'Sub Category Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'sub_icon',
      'displayName': 'Icon',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'colorCode',
      'displayName': 'Color Code',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'tax_msg',
      'displayName': 'Marketing Message',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'success_msg',
      'displayName': 'Success Message',
      'disableSorting': false,
      'class': "text-transform"

    },
    {
      'name': 'delete_status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }
  ]


  public static SubscribedUsersHeader=[
      {
      'name': 'username',
      'displayName': 'Name',
      'disableSorting': false,
      'class': "text-transform"
    },
      {
      'name': 'registerDate',
      'displayName': 'Registered Date',
      'disableSorting': false,
      'class': "text-transform"
    },
      {
      'name': 'title',
      'displayName': 'Location',
      'disableSorting': false,
      'class': "text-transform"
    },
      {
      'name': 'mobile_type',
      'displayName': 'OS-Version',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }

  ]

  public static SubscriptionListHeader = [
    {
      'name': 'title',
      'displayName': 'Title',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'type',
      'displayName': 'Type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'months',
      'displayName': 'Months',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'currency',
      'displayName': 'Currency',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'currency_symbol',
      'displayName': 'Currency Symbol',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'totaldays',
      'displayName': 'Total Days',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'amount',
      'displayName': 'Amount',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'offerAmount',
      'displayName': 'Offer Amount',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }
  ]

  public static SubscriptionFeaturesHeader = [
    {
      'name': 'title',
      'displayName': 'Title',
      'disableSorting': false,
      'class': "text-transform"
    },
    // {
    //   'name': 'icon',
    //   'displayName': 'Icon',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },

    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }
  ]


    public static BenefitsBannerHeader = [
    {
      'name': 'icon',
      'displayName': 'Banner Image',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }
  ]
  public static StoryBoardListHeader = [
    {
      'name': 'title',
      'displayName': 'Title',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'mediaType',
      'displayName': 'Media Type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'mediaUrl',
      'displayName': 'Media',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }
  ]

  public static VideosListHeader = [
    {
      'name': 'title',
      'displayName': 'Title',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'description',
      'displayName': 'Description',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'tamp_img',
      'displayName': 'Banner Image',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'videolink',
      'displayName': 'Video',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'video_img',
      'displayName': 'Video Image',
      'disableSorting': false,
      'class': "text-transform"
    },

    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    }
  ]

  public static InviteUserHeader = [
    {
      'name': 'name',
      'displayName': 'Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'number',
      'displayName': 'Number',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'createdAt',
      'displayName': 'Created Date',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]


  public static NewsHeader = [
    {
      'name': 'pagename',
      'displayName': 'Page Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'news',
      'displayName': 'News',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static HometronicsHeader = [
    {
      'name': 'catagory_type',
      'displayName': 'Catagory Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'icon',
      'displayName': 'Icon',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static shoppingcartCategoryHeader = [
    {
      'name': 'shoppingcatname',
      'displayName': 'Category Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    // {
    //   'name': 'icon',
    //   'displayName': 'Icon',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },

    // {
    //   'name': 'delete_status',
    //   'displayName': 'Status',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static shoppingcartProductsHeader = [
    {
      'name': 'productId',
      'displayName': 'Product ID',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'productName',
      'displayName': 'Product Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'price',
      'displayName': 'Price',
      'disableSorting': false,
      'class': "text-transform"
    },

    {
      'name': 'offerPrice',
      'displayName': 'Offer Percentage',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'stockQuantity',
      'displayName': 'Stock Quantity',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'isAvailable',
      'displayName': 'Available Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]


  public static Level1Header = [
    {
      'name': 'name',
      'displayName': 'Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    // {
    //   'name': 'icon',
    //   'displayName': 'Icon',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },

    // {
    //   'name': 'delete_status',
    //   'displayName': 'Status',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]


  public static bankHeader = [
    {
      'name': 'bankName',
      'displayName': 'Bank Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'icon',
      'displayName': 'Icon',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'backgroundcolor',
      'displayName': 'Background color',
      'disableSorting': false,
      'class': "text-transform"
    },
    // {
    //   'name': 'delete_status',
    //   'displayName': 'Status',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

  public static toolListHeader = [
    {
      'name': 'toolId',
      'displayName': 'ID',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'type',
      'displayName': 'Type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'toolName',
      'displayName': 'Suite Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'price',
      'displayName': 'Price',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'offerPrice',
      'displayName': 'Offer Price',
      'disableSorting': false,
      'class': "text-transform"
    },
    // {
    //   'name': 'delete_status',
    //   'displayName': 'Status',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]
  public static OnboardingquestionListHeader = [
    {
      'name': 'questionText',
      'displayName': 'Question',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'type',
      'displayName': 'Type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'inputType',
      'displayName': 'Input Type',
      'disableSorting': false,
      'class': "text-transform"
    },

    {
      'name': 'createdAt',
      'displayName': 'Created Date',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': true,
    },
  ];

  public static pushnoticationListHeader = [
    {
      'name': 'title',
      'displayName': 'Title',
      'disableSorting': false,
      'class': "text-transform"
    },
    // {
    //   'name': 'body',
    //   'displayName': 'Body',
    //   'disableSorting': false,
    //   'class': "text-transform"
    // },
    {
      'name': 'user_type',
      'displayName': 'User Type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'type',
      'displayName': 'Notification Type',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'date',
      'displayName': 'Date',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'time',
      'displayName': 'Notification Time',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'Activestatus',
      'displayName': 'Active status',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'type',
      'displayName': 'Button',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]

   public static BadgeHeader = [
    {
      'name': 'title',
      'displayName': 'Badge Name',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'points',
      'displayName': 'Fin Coin Value',
      'disableSorting': false,
      'class': "text-transform"
    },
    {
      'name': 'status',
      'displayName': 'Status',
      'disableSorting': false,
      'class': "text-transform"
    },
    
    {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },
  ]
   public static AdsHeader = [
    {
      'name': 'google_ad_maincate',
      'displayName': 'Ads Name',
      'disableSorting': false,
      'class': "text-transform"
    },
   {
      'name': 'android_active_status',
      'displayName': 'Android Status',
      'type': 'toggle',
      'disableSorting': false,
      'class': "text-transform"
    },
   {
      'name': 'ios_active_status',
      'displayName': 'IOS Status',
      'type': 'toggle',
      'disableSorting': false,
      'class': "text-transform"
    },
    
     {
      'name': 'actions',
      'displayName': 'Action',
      'disableSorting': false,
    },

  ]

}
