import {Component, OnInit} from '@angular/core';
import {BookDetailResponse} from '../../models/book.model';
import {BookService} from '../../services/book.services';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {BookCreateComponent} from '../book-create-pages/book-create';
import {BookUpdateComponent} from '../book-update-pages/book-update';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-book-detail-manager',
  standalone: true,
  templateUrl: './book-detail-manager.html',
  imports: [
    NgForOf,
    NgIf,
  ],
  styleUrls: ['./book-detail-manager.css']
})

export class BookDetailManagerComponent implements OnInit{

  bookDetail: BookDetailResponse | null = null;
  loading = true;
  bookId!: number;
  constructor(private bookService: BookService,
              private toast: ToastrService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,

  ) {
  }

  ngOnInit(){
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBookDetail();
  }

  goBack() {
    this.router.navigate(['/manager/books']);
  }

  openUpdateDialog() {
    const dialogRef = this.dialog.open(BookUpdateComponent, {
      width: '700px',
      disableClose: true,
      data: { id: this.bookId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBookDetail();
      }
    });
  }

  deleteBook() {
    if (confirm('bạn có muốn xóa cái này không?')) {
      this.bookService.deleteBook(this.bookId).subscribe({
        next: () => {
          this.router.navigate(['/manager/books']);
          this.toast.success('Xóa sách thành công');
        } ,
        error: () => this.toast.error('Xóa sách thất bại')
      });

    }
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
}
