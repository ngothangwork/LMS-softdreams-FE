import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {BookDetailResponse} from '../../models/book.model';
import {BookService} from '../../services/book.services';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css'],
  imports: [CommonModule],
})

export class BookDetailComponent implements OnInit{
  bookDetail: BookDetailResponse | null = null;
  loading = true;
  bookId!: number;
  constructor(private bookService: BookService,
              private toast: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              ) {
  }

  ngOnInit(){
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

  borrowBook () {

  }
}
