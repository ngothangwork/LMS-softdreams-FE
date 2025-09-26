import {Component} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CategoryCreate} from '../../models/category-create.model';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-category-create',
  standalone: true,
  templateUrl: './category-create.html',
  styleUrls: ['./category-create.css'],
  imports: [
    ReactiveFormsModule, CommonModule, MatDialogModule
  ]
})

export class CategoryCreateComponent {

  categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryCreateComponent>,
    private toast: ToastrService)
  {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.maxLength(500)]]
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

    const payload: CategoryCreate = this.categoryForm.value;
    this.categoryService.createCategory(payload).subscribe({
      next: res => {
        this.toast.success('Category created successfully');
        this.dialogRef.close(true);
      },
      error: err => {
        console.error('Create category failed', err);
        this.toast.error(err.error.result[0], 'Error');
      }
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }


}
