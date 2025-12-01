import {
  BcToken,
  Otp,
  SignInCredential,
  SignInResponse,
  SignUpCredential,
  SignUpResponse,
} from "@/@types/auth";
import ApiService from "./ApiService";

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: "/auth/sign-in",
    method: "post",
    data,
  });
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: "/auth/sign-up",
    method: "post",
    data,
  });
}

export async function apiOtp(data: Otp) {
  return ApiService.fetchData<any>({
    url: "/auth/verify",
    method: "post",
    data,
  });
}

export async function apiOtpResetPassword(data: Otp) {
  return ApiService.fetchData<any>({
    url: "/auth/verify-reset-password",
    method: "post",
    data,
  });
}
export async function apiSignOut() {
  return ApiService.fetchData({
    url: "/sign-out",
    method: "post",
  });
}

export async function apiBcToken() {
  return ApiService.fetchData<BcToken>({
      url: '/auth/token',
      method:'get',

  })
}


export async function apiForgotPassword(data: { email: string }) {
  return ApiService.fetchData<any>({
    url: "/auth/forgot-password",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data: { email: string; newPassword: string }) {
  return ApiService.fetchData<any>({
    url: "/auth/reset-password",
    method: "post",
    data,
  });
}
