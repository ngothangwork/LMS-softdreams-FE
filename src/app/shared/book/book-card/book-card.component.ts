import { Component, Input } from '@angular/core';
import { BookResponse } from '../../../features/book/models/book.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: BookResponse;
}
