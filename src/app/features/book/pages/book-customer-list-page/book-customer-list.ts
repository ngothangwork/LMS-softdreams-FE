import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookResponse, BookSearch } from '../../models/book.model';
import { BookService } from '../../services/book.services';
import { BookCardComponent } from '../../../../shared/book/book-card/book-card.component';

@Component({
  selector: 'app-book-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent],
  templateUrl: './book-customer-list.html',
  styleUrls: ['./book-customer-list.css']
})
export class BookCustomerListComponent implements OnInit {
  books: BookResponse[] = [];
  searchKeyword: string = '';
  type: string = 'name';

  page: number = 0;
  size: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  sortField: string = 'name';
  sortDir: string = 'asc';
  sort: string = `${this.sortField},${this.sortDir}`;

  totalElements: number = 0;
  totalPages: number = 0;

  loading = false;
  error: string | null = null;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['keyword'] || '';
      this.type = params['type'] || 'name';
      this.page = params['page'] !== undefined ? +params['page'] : 0;
      this.size = params['size'] !== undefined ? +params['size'] : 5;

      const sortParam = params['sort'] || 'name,asc';
      const parts = sortParam.split(',');
      this.sortField = parts[0] || 'name';
      this.sortDir = (parts[1] as 'asc' | 'desc') || 'asc';
      this.updateSortString();
      this.searchBooks();
    });
  }

  private updateSortString() {
    this.sort = `${this.sortField},${this.sortDir}`;
  }

  searchBooks(): void {
    const payload: BookSearch = {
      type: this.type,
      keyword: this.searchKeyword || ''
    };

    this.loading = true;
    this.error = null;
    this.bookService.searchBooks(payload, this.page, this.size, this.sort).subscribe({
      next: (res) => {
        this.books = res.result?.content || [];
        this.page = res.result?.number ?? this.page;
        this.totalElements = res.result?.totalElements ?? 0;
        this.totalPages = res.result?.totalPages ?? 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search books error', err);
        this.error = 'Failed to load books';
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page < 0) page = 0;
    if (this.totalPages && page >= this.totalPages) page = Math.max(this.totalPages - 1, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: this.searchKeyword || null,
        type: this.type,
        page,
        size: this.size,
        sort: `${this.sortField},${this.sortDir}`
      },
      queryParamsHandling: 'merge'
    });
  }

  onSortChange() {
    this.updateSortString();
    this.goToPage(0);
  }

  onSizeChange() {
    this.goToPage(0);
  }

  onSearchClick() {
    this.goToPage(0);
  }

  goToFirst() {
    this.goToPage(0);
  }

  goToLast() {
    if (this.totalPages) {
      this.goToPage(this.totalPages - 1);
    }
  }
}
