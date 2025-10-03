import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

import {AuthorUpdateResponse} from '../../../author/models/author.model';
import {PublisherResponse, PublisherUpdateResponse} from '../../../publisher/models/publisher.model';
import {CategoryResponse, CategoryUpdateResponse} from '../../../category/models/category.model';
import {BookService} from '../../services/book.services';
import {AuthorService} from '../../../author/services/author.service';
import {CategoryService} from '../../../category/services/category.service';
import {PublisherService} from '../../../publisher/services/publisher.service';
import {FileService} from '../../../../core/file/file.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.html',
  styleUrls: ['./book-create.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class BookCreateComponent implements OnInit {
  bookForm!: FormGroup;
  authors: AuthorUpdateResponse[] = [];
  categories: CategoryUpdateResponse[] = [];
  publishers: PublisherUpdateResponse[] = [];
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private fileService: FileService,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<BookCreateComponent>,
  ) {
    this.bookForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      avatar: ['',],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9\-]+$/)]],
      publisherId: ['', Validators.required],
      authorIds: [[], Validators.required],
      categoryIds: [[], Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe(res => {
        if (res.success && res.result) {
          this.bookForm.patchValue({avatar: res.result});
        }
      });
    }
  }

  authorDropdownSettings = {
    idField: 'id',
    textField: 'name',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    allowSearchFilter: true,
    enableCheckAll: true,
  };

  categoryDropdownSettings = {
    idField: 'id',
    textField: 'name',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    allowSearchFilter: true,
    enableCheckAll: true,
  };


  ngOnInit(): void {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      avatar: [''],
      isbn: ['', Validators.required],
      publisherId: [null, Validators.required],
      authorIds: [[], Validators.required],
      categoryIds: [[], Validators.required],
    });

    this.authorService.getAuthorUpdates().subscribe(res => {
      this.authors = res.result ?? [];
    });

    this.categoryService.getCategoryUpdate().subscribe(res => {
      this.categories = res.result ?? [];
    });

    this.publisherService.getPublisherUpdate().subscribe(res => {
      this.publishers = res.result ?? [];
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      const payload = {
        ...formValue,
        authorIds: formValue.authorIds.map((a: any) => a.id),
        categoryIds: formValue.categoryIds.map((c: any) => c.id),
        publisherId: formValue.publisherId
      };

      this.bookService.createBook(payload).subscribe({
        next: (res) => {
          this.toast.success('Thêm sách thành công');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error:', err);
          this.toast.error(err.error.message, 'Error');
        }
      });
    } else {
      Object.values(this.bookForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.toast.warning('Vui lòng nhập đầy đủ và đúng thông tin trước khi thêm');
    }

  }

  onClose() {
    this.dialogRef.close(false);
  }

}
