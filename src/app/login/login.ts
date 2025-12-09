import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
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
      // Single field that accepts either email or userID
      identifier: ['', [Validators.required, this.identifierValidator]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Custom validator: value must be either a valid email OR a valid userID
   */
  identifierValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = (control.value || '').trim();
    if (!value) return null; // "required" handles empties

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Adjust userID regex as per your format (EXAMPLE001 etc.)
    const userIdRegex = /^[A-Za-z0-9]{3,30}$/;

    if (emailRegex.test(value) || userIdRegex.test(value)) {
      return null;
    }

    return { identifierInvalid: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (!this.loginForm.valid) {
      this.alertService.toast(
        'error',
        true,
        'Please check your email / user ID and password'
      );
      return;
    }

    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.login;

    const identifier: string = this.loginForm.value.identifier.trim();
    const password: string = this.loginForm.value.password;

    // Backend expects { "email": "...", "password": "..." }
    // Here, "email" can be actual email OR userID string
    const payload = {
      email: identifier,
      password: password
    };

    this.navService.postData(apiUrl, payload).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          // Save token
          localStorage.setItem('token', res.data);

          // Decode token
          const tokenData: any = jwtDecode(res.data);
          console.log('tokenData', tokenData);

          // Basic user info
          localStorage.setItem('username', tokenData?.username || '');
          localStorage.setItem('role', tokenData?.role || '');

          // ✅ Correct userId from token: user_id or sub
          const userId: string = tokenData?.user_id || tokenData?.sub || '';
          if (userId) {
            localStorage.setItem('userid', userId);   // 👈 matches Home.ts
          } else {
            console.warn('No user_id/sub in token; userid not stored.');
          }

          // Role ID from token
          const roleId: string = tokenData?.role || '';

          if (roleId) {
            localStorage.setItem('roleId', roleId);

            // Fetch role details and store permissions for navbar / RBAC
            const roleApiUrl =
              ApiRoutesConstants.BASE_URL + ApiRoutesConstants.Roles_get_id + roleId;

            this.navService.getData(roleApiUrl).subscribe({
              next: (roleRes: any) => {
                if (roleRes.code === 200 && roleRes.data?.permissions) {
                  localStorage.setItem(
                    'permissions',
                    JSON.stringify(roleRes.data.permissions)
                  );
                }
                // If this fails, user is still logged in; navbar just won't see permissions
              },
              error: (err: any) => {
                console.error('Error fetching role permissions', err);
              }
            });

          } else {
            console.warn('Login token does not contain roleId');
          }

          // Success toast + redirect
          this.alertService.toast('success', true, res.message);
          this.router.navigate(['/admin/overview']);

        } else {
          this.alertService.toast('error', true, res.message);
        }
      },
      error: (error: any) => {
        console.log(error);
        this.alertService.toast('error', true, 'Login failed. Please try again.');
      }
    });
  }
}
