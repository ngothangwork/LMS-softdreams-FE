import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PublisherService } from '../../services/publisher.service';
import {PublisherUpdate} from '../../models/publisher.model';


@Component({
  selector: 'app-publisher-update',
  standalone: true,
  templateUrl: './publisher-update.html',
  styleUrls: ['./publisher-update.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PublisherUpdateComponent implements OnInit {
  publisherForm: FormGroup;
  publisherId!: number;

  constructor(
    private fb: FormBuilder,
    private publisherService: PublisherService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<PublisherUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.publisherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10)
        ]
      ]
    });
  }

  ngOnInit() {
    this.publisherId = this.data?.id;

    if (!this.publisherId) {
      this.toastr.error('Invalid publisher ID');
      this.dialogRef.close(false);
      return;
    }

    this.publisherService.getPublisherById(this.publisherId).subscribe({
      next: (res) => {
        const publisher = res.result;
        if (publisher) {
          this.publisherForm.patchValue({
            name: publisher.name,
            address: publisher.address,
            phone: publisher.phone
          });
        }
      },
      error: (err) => {
        console.error('Error fetching publisher', err);
        this.toastr.error('Load NXB thất bại');
        this.dialogRef.close(false);
      }
    });
  }

  onSubmit() {
    if (this.publisherForm.invalid) {
      this.publisherForm.markAllAsTouched();
      return;
    }

    const payload: PublisherUpdate = this.publisherForm.value;
    this.publisherService.updatePublisher(this.publisherId, payload).subscribe({
      next: () => {
        this.toastr.success('Cập nhật nhà xuất bản thành công');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Update publisher failed', err);
        this.toastr.error('Cập nhật nhà xuất bản thất bại', 'Lỗi');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
