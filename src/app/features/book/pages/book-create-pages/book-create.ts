import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AuthorResponse } from '../../../author/models/author.model';
import { PublisherResponse } from '../../../publisher/models/publisher.model';
import { CategoryResponse } from '../../../category/models/category.model';
import { BookService } from '../../services/book.services';
import { AuthorService } from '../../../author/services/author.service';
import { CategoryService } from '../../../category/services/category.service';
import { PublisherService } from '../../../publisher/services/publisher.service';
import {FileService} from '../../../../core/file/file.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
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
  authors: AuthorResponse[] = [];
  categories: CategoryResponse[] = [];
  publishers: PublisherResponse[] = [];
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private fileService: FileService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<BookCreateComponent>,
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe(res => {
        if (res.success && res.result) {
          this.bookForm.patchValue({ avatar: res.result });
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

    this.authorService.getAuthors().subscribe(res => {
      this.authors = res.result ?? [];
    });

    this.categoryService.getCategory().subscribe(res => {
      this.categories = res.result ?? [];
    });

    this.publisherService.getPublishers().subscribe(res => {
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

      this.bookService.createBook(payload).subscribe(res => {
        this.toastr.success('Thêm sách thành công');
        this.dialogRef.close(true);
      });
    }

  }

  onClose() {
    this.dialogRef.close(false);
  }

}
