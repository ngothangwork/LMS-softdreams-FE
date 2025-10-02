export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  address?: string;
  gender?: string;
  dob?: string;
}
