export class GlobalConstant {
    //Message
    public static genericError: string = "Something went wrong. Please  try again leter";

    public static unauthroized: string = "You are not authorized person to access this page.";

    public static RecordExistError:string = "Record already exist";

    public static RecordAdded:string = "Record Added successfully";

    //Regex
    public static nameRegex: string = "[a-zA-Z0-9- ]*";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";
    public static passwordRegex:any = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/;


    //Variable
    public static error: string = "error";
    public static ADD :string = "Add ";
    public  static EDIT :string = "Edit ";
    public  static VIEW :string = "View ";
    public  static UPDATE :string = "Update";
    public SUBMIT :string = "Submit";


    public static taskStatus = [
      "Completed",
      "Pending",
      "In Progress",
      "Close",
      "Open",
      "To Do"
    ];

    public static priority = [
      "low",
      "medium",
      "high",
      "critical",
    ];



}
