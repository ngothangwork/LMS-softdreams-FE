  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatDialog } from '@angular/material/dialog';
  import { BookService } from '../../services/book.services';
  import {BookResponse, BookSearch} from '../../models/book.model';
  import {BookCreateComponent} from '../book-create-pages/book-create';
  import {BookUpdateComponent} from '../book-update-pages/book-update';
  import {ActivatedRoute, Router} from '@angular/router';
  import {FormsModule, ReactiveFormsModule} from '@angular/forms';
  import {ToastrService} from 'ngx-toastr';


  @Component({
    selector: 'app-book-list',
    templateUrl: './book-list.html',
    styleUrls: ['./book-list.css'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
  })
  export class BookListComponent implements OnInit {
    books: BookResponse[] = [];
    type: string = 'name';
    searchKeyword: string = '';

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
      private dialog: MatDialog,
      private route: ActivatedRoute,
      private router: Router,
      private toastr: ToastrService
    ) {}

    ngOnInit() {
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
      })
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
      if(page < 0) page = 0;
      if(this.totalPages && page >= this.totalPages) page = Math.max(this.totalPages - 1, 0);

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
      })
    }

    loadBooks() {
      this.loading = true;
      this.error = null;
      this.searchKeyword = '';
      this.searchBooks();
    }

    openCreateDialog() {
      const dialogRef = this.dialog.open(BookCreateComponent, {
        width: '700px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadBooks();
        }
      });
    }

    openUpdateDialog(id: number) {
      const dialogRef = this.dialog.open(BookUpdateComponent, {
        width: '700px',
        disableClose: true,
        data: { id }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadBooks();
        }
      });
    }

    deleteBook(id: number) {
      if (confirm('Are you sure you want to delete this book?')) {
        this.bookService.deleteBook(id).subscribe({
          next: () => {
            this.loadBooks();
            this.toastr.success('Xóa sách thành công');
          } ,
          error: () => this.toastr.error('Xóa sách thất bại')
        });

      }
    }

    goToDetail(id: number) {
      this.router.navigate(['manager/books/detail', id]);
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
      this.searchBooks();
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
