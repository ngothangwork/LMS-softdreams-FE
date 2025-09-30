export interface  BorrowResponse {
  id: number;
  bookName: string;
  bookCopyId: number;
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
  borrowDate: string;
  returnDate: string;
  bookId: number;
  userId: string;
}
