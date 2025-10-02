import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthorService} from '../../services/author.service';
import {AuthorCreate} from '../../models/author-create.model';
import {ToastrService} from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthorUpdateComponent} from '../author-update-pages/author-update';

@Component({
  selector: 'app-author-create',
  standalone: true,
  templateUrl: './author-create.html',
  styleUrls: ['./author-create.css'],
  imports: [
    ReactiveFormsModule, CommonModule
  ]
})
export class AuthorCreateComponent {
  authorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<AuthorUpdateComponent>,
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), ]],
      dob: ['', Validators.required],
      nationality: ['', [ Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  get name() {
    return this.authorForm.get('name');
  }

  get dob() {
    return this.authorForm.get('dob');
  }

  get nationality() {
    return this.authorForm.get('nationality');
  }

  get description() {
    return this.authorForm.get('description');
  }

  onSubmit() {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      return;
    }

    const payload: AuthorCreate = this.authorForm.value;
    this.authorService.createAuthor(payload).subscribe({
      next: res => {
        this.toast.success('Thêm tác giả thành côg');
        this.dialogRef.close(true);
      },
      error: err => {
        console.error('Thêm tác giả thất bại', err);
        this.toast.error(err.error.result[0], 'Error');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
