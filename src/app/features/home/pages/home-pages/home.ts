import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  keyword: string = '';
  type: string = 'name';
  page: number = 0;
  size: number = 5;
  sort: string = 'name,asc';

  constructor(private router: Router) {}

  searchBooks() {
    if (!this.keyword.trim()) return;

    this.router.navigate(['/books/customer'], {
      queryParams: {
        keyword: this.keyword,
        type: this.type,
        page: this.page,
        size: this.size,
        sort: this.sort
      }
    });
  }
}
