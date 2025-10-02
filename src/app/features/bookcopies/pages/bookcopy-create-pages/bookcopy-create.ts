import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookCopyService } from '../../services/bookcopy.service';
import { BookCopyCreate } from '../../models/bookcopy.model';

@Component({
  selector: 'app-bookcopy-create',
  standalone: true,
  templateUrl: './bookcopy-create.html',
  styleUrls: ['./bookcopy-create.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class BookCopyCreateComponent {
  bookCopyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookCopyService: BookCopyService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<BookCopyCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookId: number }
  ) {
    this.bookCopyForm = this.fb.group({
      barcode: ['', [Validators.required, Validators.minLength(4)]],
      // bookId lấy từ data truyền vào => không nhập từ form
      bookId: [data.bookId, Validators.required],
      status: ['AVAILABLE', Validators.required]
    });
  }

  get barcode() { return this.bookCopyForm.get('barcode'); }
  get status() { return this.bookCopyForm.get('status'); }

  onSubmit() {
    if (this.bookCopyForm.invalid) {
      this.bookCopyForm.markAllAsTouched();
      return;
    }

    const payload: BookCopyCreate = this.bookCopyForm.value;
    this.bookCopyService.createBookCopy(payload).subscribe({
      next: () => {
        this.toastr.success('Thêm bản sao sách thành công');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Thêm bản sao thất bại', err);
        this.toastr.error('Thêm bản sao sách thất bại', 'Error');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
