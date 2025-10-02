import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {forkJoin} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {AuthorUpdateResponse} from '../../../author/models/author.model';
import {PublisherResponse, PublisherUpdateResponse} from '../../../publisher/models/publisher.model';
import {CategoryResponse, CategoryUpdateResponse} from '../../../category/models/category.model';
import {BookService} from '../../services/book.services';
import {AuthorService} from '../../../author/services/author.service';
import {CategoryService} from '../../../category/services/category.service';
import {PublisherService} from '../../../publisher/services/publisher.service';
import {FileService} from '../../../../core/file/file.service';
import {BookUpdate, BookUpdateResponse} from '../../models/book.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.html',
  styleUrls: ['./book-update.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class BookUpdateComponent implements OnInit {
  bookForm!: FormGroup;
  bookId!: number;
  authors: AuthorUpdateResponse[] = [];
  categories: CategoryUpdateResponse[] = [];
  publishers: PublisherUpdateResponse[] = [];
  selectedFile?: File;

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

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private fileService: FileService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<BookUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
  }

  ngOnInit(): void {
    this.bookId = this.data?.id;
    if (!this.bookId) {
      console.error('Không có bookId được truyền vào dialog');
      return;
    }

    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      avatar: [''],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]+$/)]],
      publisherId: [null, Validators.required],
      authorIds: [[], Validators.required],
      categoryIds: [[], Validators.required],
    });

    this.loadData();
  }

  loadData() {
    forkJoin({
      authors: this.authorService.getAuthorUpdates(),
      categories: this.categoryService.getCategoryUpdate(),
      publishers: this.publisherService.getPublisherUpdate(),
      book: this.bookService.getBookUpdate(this.bookId)
    }).subscribe({
      next: ({authors, categories, publishers, book}) => {
        this.authors = authors.result ?? [];
        this.categories = categories.result ?? [];
        this.publishers = publishers.result ?? [];
        const b: BookUpdateResponse = book.result;

        this.bookForm.patchValue({
          name: b.name,
          avatar: b.avatar,
          isbn: b.isbn,
          publisherId: b.publisherId,
          authorIds: this.authors.filter(a => b.authorIds.includes(a.id)),
          categoryIds: this.categories.filter(c => b.categoryIds.includes(c.id)),
        });


      },
      error: () => alert('Failed to load data!')
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (res) => {
          if (res.success && res.result) {
            this.bookForm.patchValue({avatar: res.result});
          }
        },
        error: () => alert('Upload file failed!')
      });
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      this.toastr.error('Vui lòng kiểm tra lại thông tin nhập vào', 'Form không hợp lệ');
      return;
    }

    const formValue = this.bookForm.value;
    const payload: BookUpdate = {
      ...formValue,
      authorIds: formValue.authorIds.map((a: any) => a.id),
      categoryIds: formValue.categoryIds.map((c: any) => c.id),
      publisherId: formValue.publisherId
    };

    this.bookService.patchBook(this.bookId, payload).subscribe({
      next: () => {
        this.toastr.success('Update success!');
        this.dialogRef.close(true);
      },
      error: () => this.toastr.error('Update failed!')
    });
  }


  onClose() {
    this.dialogRef.close(false);
  }
}
