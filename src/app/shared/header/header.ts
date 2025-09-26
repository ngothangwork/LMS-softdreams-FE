import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../core/auth/auth';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [CommonModule, NgOptimizedImage, RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit {
  user: any;
  isLogin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isLogin = !!this.user;
  }

  logout() {
    this.authService.logout();
    this.isLogin = false;
    this.user = null;
  }
}
