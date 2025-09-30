import {Component, OnInit} from '@angular/core';
import {BookDetailResponse} from '../../models/book.model';
import {BookService} from '../../services/book.services';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {BookUpdateComponent} from '../book-update-pages/book-update';
import {MatDialog} from '@angular/material/dialog';
import {BookCopyService} from '../../../bookcopies/services/bookcopy.service';
import {BookCopyListResponse} from '../../../bookcopies/models/bookcopy.model';

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
  bookCopies: BookCopyListResponse[] = [];

  constructor(private bookService: BookService,
              private toast: ToastrService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private bookCopyService: BookCopyService,

  ) {
  }

  ngOnInit(){
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBookCopies();
    this.loadBookDetail();
  }

  goBack() {
    this.router.navigate(['/manager/books']);
  }

  loadBookCopies() {
    this.bookCopyService.getBookCopyByBookId(this.bookId).subscribe({
      next: (data) => {
        this.bookCopies = data.result;
      },
      error: (err) => {
        console.error('Error fetching book copies:', err);
        this.toast.error('Error fetching book copies', 'Error');
      }
    });
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
