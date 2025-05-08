import {
  BcToken,
  ForgotPassword,
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


export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: "/forgot-password",
    method: "post",
    data,
  });
}
