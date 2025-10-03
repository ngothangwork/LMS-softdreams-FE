import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {BookDetailResponse, BookDetailResponseDTO} from '../../models/book.model';
import {BookService} from '../../services/book.services';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../core/auth/auth';
import {BorrowCreateComponent} from '../../../borrow/pages/borrow-create-pages/borrow-create';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css'],
  imports: [CommonModule],
})

export class BookDetailComponent implements OnInit {
  bookDetail: BookDetailResponseDTO | null = null;
  loading = true;
  bookId!: number;

  constructor(private bookService: BookService,
              private toast: ToastrService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBookDetail();
  }

  loadBookDetail() {
    this.loading = true;
    this.bookService.getBook(this.bookId).subscribe({
        next: (data) => {
          this.bookDetail = data.result;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching book detail:', err);
          this.toast.error('Error fetching book detail', 'Error');
          this.loading = false;
        }
      }
    )
  }

  openCreateDialog(bookId: number) {
    const token = this.authService.getToken();
    if (!token) {
      this.toast.info('Bạn cần đăng nhập để thực hiện chức năng này');
      this.router.navigate(['/login'], { queryParams: { redirect: `/book/${bookId}` } });
      return;
    }

    const dialogRef = this.dialog.open(BorrowCreateComponent, {
      width: '600px',
      disableClose: true,
      data: { bookId, userId: this.authService.getUser()?.userId || 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toast.success('Đăng ký mượn sách thành công, chờ quản lý phê duyệt');
      }
    });
  }



}
