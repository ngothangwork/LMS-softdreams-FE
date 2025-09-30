export interface AuthorResponse {
  id: number;
  name: string;
  dob: Date;
  nationality: string;
  description: string;
}

export interface AuthorUpdateResponse {
  id: number;
  name: string;
}
