import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../../../core/auth/auth';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success("Đăng nhập thành công");
          this.router.navigate(['/home']);
        } else {
          console.error('Login thất bại:', res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.result?.[0]);
        console.error('Lỗi API:', err);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
