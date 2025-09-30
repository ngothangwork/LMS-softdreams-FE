import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BorrowService } from '../../services/borrow.services';
import { AuthService } from '../../../../core/auth/auth';
import {BorrowCreateRequest} from '../../models/borrow.models';

@Component({
  selector: 'app-borrow-create',
  standalone: true,
  templateUrl: './borrow-create.html',
  styleUrls: ['./borrow-create.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class BorrowCreateComponent implements OnInit {
  borrowForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<BorrowCreateComponent>,
    private borrowService: BorrowService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { bookId: number, userId: string }
  ) {}

  ngOnInit(): void {
    this.borrowForm = this.fb.group({
      days: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(1),
          Validators.max(7)
        ]
      ]
    });
  }

  onSubmit() {
    if (this.borrowForm.invalid) {
      this.toast.error('Số ngày mượn phải là số nguyên từ 1 đến 7');
      this.borrowForm.markAllAsTouched();
      return;
    }

    const days = Number(this.borrowForm.value.days);

    const formatDate = (d: Date) => d.toLocaleDateString('en-CA');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const borrowDateObj = new Date(today);
    borrowDateObj.setDate(today.getDate() + 1);
    const borrowDate = formatDate(borrowDateObj);

    const returnDateObj = new Date(borrowDateObj);
    returnDateObj.setDate(borrowDateObj.getDate() + days);
    const returnDate = formatDate(returnDateObj);

    if (returnDateObj <= borrowDateObj) {
      this.toast.error('Ngày trả phải lớn hơn ngày mượn');
      return;
    }

    const request: BorrowCreateRequest = {
      borrowDate,
      returnDate,
      bookId: this.data.bookId,
      userId: this.data.userId,
    };

    console.log('Borrow request:', request);

    this.borrowService.createBorrow(request).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.toast.error('Đăng ký mượn thất bại');
      }
    });
  }


  onClose() {
    this.dialogRef.close(false);
  }
}
