import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BorrowService} from '../../services/borrow.services';
import {BorrowResponse} from '../../models/borrow.models';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-borrow-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrow-list.html',
  styleUrls: ['./borrow-list.css']
})
export class BorrowListComponent implements OnInit {
  borrows: BorrowResponse[] = [];
  loading = true;

  constructor(
    private borrowService: BorrowService,
    private toast: ToastrService,
    private router: Router
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

  goToEdit(borrowId: number) {
    this.router.navigate(['/borrows', borrowId, 'edit']);
  }

  export(format: string) {
    this.borrowService.exportBorrows(format).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `borrows.${format}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.toast.success(`Xuất file ${format.toUpperCase()} thành công`);
      },
      error: () => {
        this.toast.error(`Xuất file ${format.toUpperCase()} thất bại`);
      }
    });
  }
}
