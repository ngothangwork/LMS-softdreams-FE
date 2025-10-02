import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BorrowService} from '../../services/borrow.services';
import {BorrowResponse, BorrowSearch, BorrowUpdateRequest} from '../../models/borrow.models';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
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
  searchKeyword: string = '';

  page: number = 0;
  size: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  sortField: string = 'name';
  sortDir: string = 'asc';
  sort: string = `${this.sortField},${this.sortDir}`;

  totalElements: number = 0;
  totalPages: number = 0;

  error: string | null = null;


  bookCopiesMap: { [borrowId: number]: BookCopyListResponse[] } = {};
  selectedBookCopy: { [borrowId: number]: number | null } = {};

  loading = false;

  constructor(
    private borrowService: BorrowService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private bookCopyService: BookCopyService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['keyword'] || '';
      this.page = params['page'] !== undefined ? +params['page'] : 0;
      this.size = params['size'] !== undefined ? +params['size'] : 5;

      const sortParam = params['sort'] || 'name,asc';
      const parts = sortParam.split(',');
      this.sortDir = (parts[1] as 'asc' | 'desc') || 'asc';
      this.updateSortString();
      this.loadBorrows();
    })

  }

  private updateSortString() {
    this.sort = `${this.sortField},${this.sortDir}`;
  }

  searchBorrow(): void {
    const payload: BorrowSearch = {
      keyword: this.searchKeyword || ''
    }

    this.loading = true;
    this.error = null;
    this.borrowService.searchBorrows(payload, this.page, this.size, this.sort).subscribe({
      next: (res) => {
        this.borrows = res.result?.content || [];
        this.page = res.result?.number ?? this.page;
        this.totalElements = res.result?.totalElements ?? 0;
        this.totalPages = res.result?.totalPages ?? 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search borrow error', err);
        this.error = 'Failed to load borrows';
      }
    })
  }

  goToPage(page: number) {
    if(page < 0) page = 0;
    if(this.totalPages && page >= this.totalPages) page = Math.max(this.totalPages - 1, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: this.searchKeyword || null,
        page,
        size: this.size,
        sort: `${this.sortField},${this.sortDir}`
      },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.searchBorrow();
    })
  }

  loadBorrows() {
    this.loading = true;
    this.error = null;
    this.searchBorrow();
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

  onSortChange() {
    this.updateSortString();
    this.goToPage(0);
  }

  onSizeChange() {
    this.goToPage(0);
  }

  onSearchClick() {
    this.goToPage(0);
    this.searchBorrow();
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
