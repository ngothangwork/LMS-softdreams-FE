import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

import { BookCopyResponse } from '../../models/bookcopy.model';
import { BookCopyService } from '../../services/bookcopy.service';

import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog.component';
import {BookCopyCreateComponent} from '../bookcopy-create-pages/bookcopy-create';
import {BookCopyUpdateComponent} from '../bookcopy-update-pages/bookcopy-update';

@Component({
  selector: 'app-bookcopy-list',
  standalone: true,
  templateUrl: './bookcopy-list.html',
  styleUrls: ['./bookcopy-list.css'],
  imports: [CommonModule]
})
export class BookCopyListComponent implements OnInit {
  bookCopies: BookCopyResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private bookCopyService: BookCopyService,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.loadBookCopies();
  }

  loadBookCopies() {
    this.loading = true;
    this.error = null;

    this.bookCopyService.getAllBookCopies().subscribe({
      next: (res) => {
        this.bookCopies = res.result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching book copies:', err);
        this.error = 'Không thể tải danh sách bản sao sách';
        this.toast.error(this.error, 'Lỗi');
        this.loading = false;
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(BookCopyCreateComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBookCopies();
      }
    });
  }

  openUpdateDialog(id: number) {
    const dialogRef = this.dialog.open(BookCopyUpdateComponent, {
      width: '600px',
      disableClose: true,
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBookCopies();
      }
    });
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { message: 'Bạn có chắc chắn muốn xóa bản sao sách này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookCopyService.deleteBookCopy(id).subscribe({
          next: () => {
            this.toast.success('Xóa bản sao sách thành công');
            this.loadBookCopies();
          },
          error: () => {
            this.toast.error('Xóa bản sao sách thất bại', 'Lỗi');
          }
        });
      }
    });
  }
}
