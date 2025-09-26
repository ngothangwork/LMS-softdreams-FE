import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {CategoryResponse} from '../../models/category.model';
import {CategoryService} from '../../services/category.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CategoryCreateComponent} from '../category-create-page/category-create';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CategoryUpdateComponent} from '../category-update-page/category-update';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule
  ]
})

export class CategoryListComponent implements OnInit{

  categories: CategoryResponse[] = [];
  loading = true;
  searchName: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService,
  ) {
  }

  ngOnInit(){
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        this.categories = data.result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loading = false;
      }
    })
  }

  onSearch() {
    if (!this.searchName.trim()) {
      this.loadCategories();
      return;
    }

    this.loading = true;

    this.categoryService.getByCategoryName(this.searchName).subscribe({
      next: (data) => {
        this.categories = data.result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.loading = false;
      }
    })
  }

  onCreate() {
    this.router.navigate(['/manager/categories/create']);
  }

  onUpdate(id: number) {
    this.router.navigate(['/manager/categories/update', id]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toast.success('Xóa thể loại thành công');
          this.loadCategories();
        },
        error: (err) => {
          this.toast.error('Xóa thể loại thất bại vì có sách đang dùng thể loại này');
        }
      })
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CategoryCreateComponent, {
      width: '700px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openUpdateDialog(id: number) {
    const dialogRef = this.dialog.open(CategoryUpdateComponent, {
      width: '700px',
      disableClose: true,
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }
}
