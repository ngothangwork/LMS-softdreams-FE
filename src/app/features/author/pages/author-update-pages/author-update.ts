import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorService } from '../../services/author.service';
import { AuthorUpdate } from '../../models/author-update.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-author-update',
  standalone: true,
  templateUrl: './author-update.html',
  styleUrls: ['./author-update.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AuthorUpdateComponent implements OnInit {
  authorForm: FormGroup;
  authorId!: number;

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AuthorUpdateComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      dob: ['', Validators.required],
      nationality: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.authorId = this.data?.id;

    if (!this.authorId) {
      this.toastr.error('Invalid author ID');
      this.router.navigate(['/manager/authors']);
      return;
    }

    this.authorService.getAuthor(this.authorId).subscribe({
      next: (res) => {
        const author = res.result;
        if (author) {
          this.authorForm.patchValue({
            name: author.name,
            dob: author.dob,
            nationality: author.nationality,
            description: author.description
          });
        }
      },
      error: (err) => {
        console.error('Error fetching author', err);
        this.toastr.error('Load tác giả thất bại');
        this.router.navigate(['/authors']);
      }
    });
  }

  onSubmit() {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      return;
    }

    const payload: AuthorUpdate = this.authorForm.value;
    this.authorService.updateAuthor(this.authorId, payload).subscribe({
      next: () => {
        this.toastr.success('Cập nhật tác giả thành công');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Update author failed', err);
        this.toastr.error('Cập nhật tác giả thất bại', 'Lỗi');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
