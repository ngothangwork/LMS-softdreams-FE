import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BorrowService} from '../../services/borrow.services';
import {BorrowResponse, BorrowUpdateRequest} from '../../models/borrow.models';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {BookCopyListResponse} from '../../../bookcopies/models/bookcopy.model';
import {BookCopyService} from '../../../bookcopies/services/bookcopy.service';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-borrow-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './borrow-list.html',
  styleUrls: ['./borrow-list.css']
})
export class BorrowListComponent implements OnInit {
  borrows: BorrowResponse[] = [];
  bookCopiesMap: { [borrowId: number]: BookCopyListResponse[] } = {};
  selectedBookCopy: { [borrowId: number]: number | null } = {};

  loading = true;

  constructor(
    private borrowService: BorrowService,
    private toast: ToastrService,
    private router: Router,
    private bookCopyService: BookCopyService,
  ) {}

  ngOnInit(): void {
    this.loadBorrows();
  }

  loadBorrows() {
    this.loading = true;
    this.borrowService.getAllBorrows().subscribe({
      next: (res) => {
        this.borrows = res.result || [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Không thể tải danh sách borrow');
        this.loading = false;
      }
    });
  }

  loadBookCopies(borrow: BorrowResponse) {
    if (!borrow.bookId) {
      this.toast.error('Borrow không có bookId');
      return;
    }
    this.bookCopyService.getBookCopyByBookIdAndStatus(borrow.bookId).subscribe({
      next: (data) => {
        this.bookCopiesMap[borrow.id] = data.result || [];
      },
      error: (err) => {
        console.error('Error fetching book copies:', err);
        this.toast.error('Error fetching book copies', 'Error');
      }
    });
  }

  acceptBorrow(borrow: BorrowResponse) {
    const bookCopyId = this.selectedBookCopy[borrow.id];
    if (!bookCopyId) {
      this.toast.warning('Vui lòng chọn BookCopy trước khi chấp nhận');
      return;
    }

    const request: BorrowUpdateRequest = {
      bookCopyId: bookCopyId,
      status: 'BORROWED'
    };

    this.borrowService.updateBorrow(borrow.id, request).subscribe({
      next: () => {
        this.toast.success('Borrow đã được chấp nhận');
        this.loadBorrows();
      },
      error: () => this.toast.error('Không thể chấp nhận borrow')
    });
  }

  rejectBorrow(borrow: BorrowResponse) {
    this.borrowService.updateBorrowStatus(borrow.id, 'CANCELLED').subscribe({
      next: () => {
        this.toast.success('Borrow đã bị từ chối');
        this.loadBorrows();
      },
      error: () => this.toast.error('Không thể từ chối borrow')
    });
  }

  returnBorrow(borrow: BorrowResponse) {
    if (borrow.status !== 'BORROWED') {
      this.toast.warning('Chỉ có thể trả sách khi đang ở trạng thái BORROWED');
      return;
    }
    this.borrowService.updateBorrowStatus(borrow.id, 'RETURNED').subscribe({
      next: () => {
        this.toast.success('Borrow đã được trả sách');
        this.loadBorrows();
      },
      error: () => this.toast.error('Không thể trả sách'),
    });
  }


  exportPdf() {
    this.borrowService.exportPdf().subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'borrows.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('Không thể xuất PDF'),
    });
  }

  exportExcel() {
    this.borrowService.exportExcel().subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'borrows.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('Không thể xuất Excel'),
    });
  }


  onDropdownOpen(borrow: BorrowResponse) {
    if (!this.bookCopiesMap[borrow.id]) {
      this.loadBookCopies(borrow);
    }
  }

}
