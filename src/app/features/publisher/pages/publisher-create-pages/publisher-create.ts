import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { PublisherService } from '../../services/publisher.service';
import { PublisherUpdateComponent } from '../publisher-update-pages/publisher-update';
import {PublisherCreate} from '../../models/publisher.model';

@Component({
  selector: 'app-publisher-create',
  standalone: true,
  templateUrl: './publisher-create.html',
  styleUrls: ['./publisher-create.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class PublisherCreateComponent {
  publisherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private publisherService: PublisherService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<PublisherUpdateComponent>,
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

  get name() { return this.publisherForm.get('name'); }
  get address() { return this.publisherForm.get('address'); }
  get phone() { return this.publisherForm.get('phone'); }

  onSubmit() {
    if (this.publisherForm.invalid) {
      this.publisherForm.markAllAsTouched();
      return;
    }

    const payload: PublisherCreate = this.publisherForm.value;
    this.publisherService.createPublisher(payload).subscribe({
      next: () => {
        this.toastr.success('Thêm nhà xuất bản thành công');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Thêm NXB thất bại', err);
        this.toastr.error('Thêm nhà xuất bản thất bại', 'Error');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
