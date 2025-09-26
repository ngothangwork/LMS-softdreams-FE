import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { CategoryService } from '../../services/category.service';
import { CategoryUpdate } from '../../models/category-update.model';
import { CategoryResponse } from '../../models/category.model';

@Component({
  selector: 'app-category-update',
  standalone: true,
  templateUrl: './category-update.html',
  styleUrls: ['./category-update.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class CategoryUpdateComponent implements OnInit {
  categoryForm: FormGroup;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryUpdateComponent>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getByCategoryId(this.data.id).subscribe({
      next: (res) => {
        const category: CategoryResponse = res.result;
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load category', err);
        this.toast.error('Không thể tải dữ liệu thể loại');
        this.dialogRef.close(false);
      }
    });
  }

  get name() {
    return this.categoryForm.get('name');
  }
  get description() {
    return this.categoryForm.get('description');
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload: CategoryUpdate = this.categoryForm.value;
    this.categoryService.updateCategory(this.data.id, payload).subscribe({
      next: () => {
        this.toast.success('Cập nhật thể loại thành công');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Update category failed', err);
        this.toast.error(err.error?.result?.[0] || 'Cập nhật thất bại');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
