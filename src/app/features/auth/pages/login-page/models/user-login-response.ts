export interface UserLoginResponse {
  userId: string;
  username: string;
  fullName: string;
  token: string;
  refreshToken: string;
  userRole: string;
}
