import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

import { PublisherResponse } from '../../models/publisher.model';
import { PublisherService } from '../../services/publisher.service';
import { PublisherCreateComponent } from '../publisher-create-pages/publisher-create';
import { PublisherUpdateComponent } from '../publisher-update-pages/publisher-update';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  templateUrl: './publisher-list.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./publisher-list.css']
})
export class PublisherListComponent implements OnInit {
  publishers: PublisherResponse[] = [];
  searchName: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private publisherService: PublisherService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadPublishers();
  }

  loadPublishers() {
    this.loading = true;
    this.error = null;

    this.publisherService.getPublisherByName(this.searchName).subscribe({
      next: (res) => {
        this.publishers = res.result;
        this.loading = false;
        if (this.searchName) {
          this.toastr.success(
            `Tìm thấy ${this.publishers.length} nhà xuất bản`,
            'Thành công'
          );
        }
      },
      error: (err) => {
        console.error('Error fetching publishers:', err);
        this.error = 'Không thể tải danh sách publishers';
        this.toastr.error(this.error, 'Lỗi');
        this.loading = false;
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(PublisherCreateComponent, {
      width: '700px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPublishers();
      }
    });
  }

  openUpdateDialog(id: number) {
    const dialogRef = this.dialog.open(PublisherUpdateComponent, {
      width: '700px',
      disableClose: true,
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPublishers();
      }
    });
  }

  onSearch() {
    this.loadPublishers();
  }

  onDelete(id: number) {
    if (confirm('Bạn có chắc muốn xóa nhà xuất bản này không?')) {
      this.publisherService.deletePublisher(id).subscribe({
        next: () => {
          this.toastr.success('Xóa nhà xuất bản thành công');
          this.loadPublishers();
        },
        error: () => {
          this.toastr.error('Xóa thất bại vì có sách thuộc nhà xuất bản này!!!');
        }
      });
    }
  }
}
