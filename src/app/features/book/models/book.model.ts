import {PublisherResponse} from '../../publisher/models/publisher.model';
import {AuthorResponse} from '../../author/models/author.model';
import {CategoryResponse} from '../../category/models/category.model';

export interface BookResponse {
  id: number;
  name: string;
  avatar: string;
  isbn: string;
}


export interface BookCreate {
  name: string;
  avatar: string;
  isbn: string;
  publisherId: number;
  authorIds: number[];
  categoryIds: number[];
}

export interface BookSearch {
  type: string;
  keyword: string;
}

export interface BookUpdate {
  name: string;
  avatar: string;
  isbn: string;
  publisherId: number;
  authorIds: number[];
  categoryIds: number[];
}

export interface BookUpdateResponse {
  name: string;
  avatar: string;
  isbn: string;
  publisherId: number;
  authorIds: number[];
  categoryIds: number[];
}


export interface BookDetailResponse {
  id: number;
  name: string;
  isbn: string;
  avatar: string;
  publisher: PublisherResponse;
  authors: AuthorResponse[];
  categories: CategoryResponse[];
  numberOfBorrowed: number;
  numberOfAvailable: number;
}

export interface BookDetailResponseDTO {
  id: number;
  name: string;
  isbn: string;
  avatar: string;
  publisherName: string;
  authors: string;
  categories: string;
  numberOfBorrowed: number;
  numberOfAvailable: number;
}
