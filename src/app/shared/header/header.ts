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
  isAdmin = false;
  isLibrarian = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isLogin = !!user;
      this.isAdmin = user?.userRole === 'ADMIN';
      this.isLibrarian = user?.userRole === 'LIBRARIAN';
    });
  }

  logout() {
    this.authService.logout();
    this.isLogin = false;
    this.user = null;
    this.isAdmin = false;
    this.isLibrarian = false;
  }
}
