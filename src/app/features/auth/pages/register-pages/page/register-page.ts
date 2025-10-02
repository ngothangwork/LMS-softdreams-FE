import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core/auth/auth';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    protected router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^[0-9]{9,15}$/)]],
      fullName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ỹ ]+$/), Validators.minLength(8), Validators.maxLength(50)]],
      address: ['', [Validators.maxLength(255)]],
      gender: [''],
      dob: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Đăng ký thành công');
          this.router.navigate(['/login']);
        } else {
          this.toast.error(res.message);
        }
      },
      error: (err) => {
        this.toast.error(err.error.result?.[0] || 'Lỗi đăng ký');
        console.error('Lỗi API:', err);
      }
    });
  }
}
