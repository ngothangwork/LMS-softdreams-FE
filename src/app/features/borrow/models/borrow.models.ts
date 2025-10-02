export interface  BorrowResponse {
  id: number;
  bookId: number;
  bookName: string;
  bookCopyId: number;
  barcode: string;
  username: string;
  borrowDate: string;
  returnDate: string;
  status: string;
}

export interface  BorrowCreateRequest {
  borrowDate: string;
  returnDate: string;
  bookId: number;
  userId: string;
}

export interface  BorrowUpdateRequest {
  bookCopyId: number;
  status: string;
}


export interface  BorrowUpdateStatusRequest {
  status: string;
}
