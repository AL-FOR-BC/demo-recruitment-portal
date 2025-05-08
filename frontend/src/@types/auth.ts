export interface SignInCredential extends Record<string, unknown> {
  email: string;
  password: string;

}

export interface SignInResponse {
  signature: string;
  email: string;
  verified: boolean;
  fullName:string;
  companyId:string
}

export interface SignUpResponse {
  signature: string;
  email: string;
  verified: boolean;
}

export interface SignUpCredential extends Record<string, unknown> {
  email: string;
  fullName: string;
  password: string;
}

export interface Otp extends Record<string, unknown> {
  otp: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  password: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export type BcToken = {
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};

export interface JWTPayload {
  email: string;
  id: string;
  verified: boolean;
}
//
