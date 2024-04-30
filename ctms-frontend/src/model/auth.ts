export type AuthenticationResponse = {
  email: string;
  username: string;
  image: string;
  isActive: boolean;
  role: string;
  userExisted: boolean;
  status: number;
  token: string;
  refreshToken: string;
  userId: string;
  userNumber: string;
};

export type AuthenticationRequest = {
  username: string;
  password: string;
  email: string;
};
export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
};
export type ChangePasswordRequest = {
  oldPass?: string;
  newPass: string;
  verifyPass: string;
  email?: string;
};
export type VerifyOtpRequest = {
  otp: string;
  email: string;
};
