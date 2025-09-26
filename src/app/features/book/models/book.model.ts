import {PublisherResponse} from '../../publisher/models/publisher.model';
import {AuthorResponse} from '../../author/models/author.model';
import {CategoryResponse} from '../../category/models/category.model';

export interface BookResponse {
  id: number;
  name: string;
  isbn: string;
  avatar: string;
  authorIds: number[];
  categoryIds: number[];
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

export interface BookDetailManagerResponse {

}
