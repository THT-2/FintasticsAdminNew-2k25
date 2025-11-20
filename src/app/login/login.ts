import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from '../home/home-routing-module';
import { ApiRoutesConstants } from '../constants/api-route-constants';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Data } from '../Service/data';
import { AlertService } from '../constants/alertservice';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HomeRoutingModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [AlertService]
})
export class Login {

  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private navService: Data,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

togglePassword() {
  this.showPassword = !this.showPassword;
}

  onSubmit() {
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.valid) {
      const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.login;

      this.navService.postData(apiUrl, this.loginForm.value).subscribe({
  next: (res: any) => {
    if (res.code === 200) {

      localStorage.setItem('token', res.data);

      let tokenData: any = jwtDecode(res.data);
      console.log("tokenData", tokenData);

      localStorage.setItem('username', tokenData?.username || '');
      localStorage.setItem('role', tokenData?.role || '');

      const roleId =  tokenData?.role || '';
      if (roleId) {
        localStorage.setItem('roleId', roleId);
      } else {
        console.warn("Login token does not contain roleId");
      }

      this.alertService.toast("success", true, res.message);
      this.router.navigate(['/admin/overview']);
    } else {
      this.alertService.toast("error", true, res.message);
    }
  },
  error: (error: any) => {
    console.log(error);
    this.alertService.toast("error", true, "Login failed. Please try again.");
  }
});

    } else {
      this.alertService.toast("error", true, "Please check your email address and password");
    }
  }
}
