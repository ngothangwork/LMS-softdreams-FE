import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { BookCopyService } from '../../services/bookcopy.service';
import { BookCopyUpdate } from '../../models/bookcopy.model';

@Component({
  selector: 'app-bookcopy-update',
  standalone: true,
  templateUrl: './bookcopy-update.html',
  styleUrls: ['./bookcopy-update.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BookCopyUpdateComponent implements OnInit {
  bookCopyForm: FormGroup;
  bookCopyId!: number;

  constructor(
    private fb: FormBuilder,
    private bookCopyService: BookCopyService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<BookCopyUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.bookCopyForm = this.fb.group({
      barcode: ['', [Validators.required, Validators.minLength(4)]],
      status: ['AVAILABLE', Validators.required]
    });
  }

  ngOnInit() {
    this.bookCopyId = this.data?.id;

    if (!this.bookCopyId) {
      this.toastr.error('Invalid book copy ID');
      this.dialogRef.close(false);
      return;
    }

    this.bookCopyService.getBookCopyById(this.bookCopyId).subscribe({
      next: (res) => {
        const bc = res.result[0];
        if (bc) {
          this.bookCopyForm.patchValue({
            barcode: bc.barcode,
            status: bc.status
          });
        }
      },
      error: (err) => {
        console.error('Error fetching book copy', err);
        this.toastr.error('Load bản sao thất bại');
        this.dialogRef.close(false);
      }
    });
  }

  onSubmit() {
    if (this.bookCopyForm.invalid) {
      this.bookCopyForm.markAllAsTouched();
      return;
    }

    const payload: BookCopyUpdate = this.bookCopyForm.value;
    this.bookCopyService.updateBookCopy(this.bookCopyId, payload).subscribe({
      next: () => {
        this.toastr.success('Cập nhật bản sao sách thành công');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Update book copy failed', err);
        this.toastr.error('Cập nhật bản sao sách thất bại', 'Lỗi');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
