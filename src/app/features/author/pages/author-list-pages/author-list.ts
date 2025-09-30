import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthorResponse } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {AuthorCreateComponent} from '../author-create-pages/author-create';
import {AuthorUpdateComponent} from '../author-update-pages/author-update';
import {ConfirmDialogComponent} from '../../../../shared/ui/confirm-dialog.component';

@Component({
  selector: 'app-author-list',
  standalone: true,
  templateUrl: './author-list.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./author-list.css']
})
export class AuthorListComponent implements OnInit {
  authors: AuthorResponse[] = [];
  searchName: string = '';

  page: number = 0;
  size: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  sortField: string = 'name';
  sortDir: string = 'asc';
  sort: string = `${this.sortField},${this.sortDir}`;

  totalElements: number = 0;
  totalPages: number = 0;

  loading = false;
  error: string | null = null;

  constructor(
    private authorService: AuthorService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] !== undefined ? +params['page'] : 0;
      this.size = params['size'] !== undefined ? +params['size'] : 5;

      const sortParam = params['sort'] || 'name,asc';
      const parts = sortParam.split(',');
      this.sortField = parts[0] || 'name';
      this.sortDir = (parts[1] as 'asc' | 'desc') || 'asc';
      this.updateSortString();
      this.loadAuthors();
    })

  }

  private updateSortString() {
    this.sort = `${this.sortField},${this.sortDir}`;
  }

  goToPage(page: number) {
    if(page < 0) page = 0;
    if(this.totalPages && page >= this.totalPages) page = Math.max(this.totalPages - 1, 0);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        name: this.searchName || null,
        page: page,
        size: this.size,
        sort: `${this.sortField},${this.sortDir}`
      },
      queryParamsHandling: 'merge'
    })
  }

  loadAuthors() {
    this.loading = true;
    this.authorService.searchAuthors(
      this.searchName,
      this.page,
      this.size,
      this.sort
    ).subscribe({
      next: (data) => {
        const result = data.result;
        this.authors = result.content;
        this.totalElements = result.totalElements;
        this.totalPages = result.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching authors:', err);
        this.loading = false;
      }
    });
  }


  openCreateDialog() {
    const dialogRef = this.dialog.open(AuthorCreateComponent, {
      width: '700px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAuthors();
      }
    });
  }

  openUpdateDialog(id: number) {
    const dialogRef = this.dialog.open(AuthorUpdateComponent, {
      width: '700px',
      disableClose: true,
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAuthors();
      }
    });
  }

  onSearch() {
    this.page = 0;
    this.goToPage(0);
  }



  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { message: 'Bạn có chắc chắn muốn xóa thể loại này?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authorService.deleteAuthor(id).subscribe({
          next: () => {
            this.toast.success('Xóa thể loại thành công');
            this.loadAuthors();
          },
          error: () => {
            this.toast.error('Xóa thể loại thất bại vì có sách đang dùng thể loại này');
          }
        });
      }
    });
  }

  onSortChange() {
    this.updateSortString();
    this.goToPage(0);
  }

  onSizeChange() {
    this.goToPage(0);
  }

  goToFirst() {
    this.goToPage(0);
  }

  goToLast() {
    if (this.totalPages) {
      this.goToPage(this.totalPages - 1);
    }
  }
}
