export interface BookCopyResponse {
  id: number;
  barcode: string;
  bookId: number;
  title: string;
  status: string;
}

export interface BookCopyListResponse {
  id: number;
  barcode: string;
  bookId: number;
  status: string;
}

export interface BookCopyCreate {
  barcode: string;
  bookId: number;
  status: string;
}

export interface BookCopyUpdate {
  barcode: string;
  status: string;
}
