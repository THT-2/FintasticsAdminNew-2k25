import Swal from "sweetalert2";
// import CoolAlert from "coolalertjs";


export class AlertService {
  show(Message:any) {
    Swal.fire({
      title: 'Error!',
      text: Message,
      icon: "error",
      confirmButtonText: 'OK'
    });
  }

  toast(typeIcon:any, timerProgressBar: boolean = false, message:string) {
    Swal.fire({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar,
      timer: 2000,
      title: message
    })
  }
}

// CoolAlert.show({
//   icon: "success",
//   title: "Great!",
//   text: "Everything worked perfectly!",
// });
