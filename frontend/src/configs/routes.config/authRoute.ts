import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const authRoute: Routes = [
  {
    key: "signIn",
    path: `/sign-in`,
    component: lazy(() => import("@/view/auth/SignIn")),
    authority: [],
  },
  {
    key: "signUp",
    path: `/sign-up`,
    component: lazy(() => import("@/view/auth/SignUp")),
    authority: [],
  },
  {
    key: "OTP",
    path: "/otp",
    component: lazy(() => import("@/view/auth/OTP")),
    authority: [],
  },
  {
    key: "forgotPassword",
    path: "/forgot-password",
    component: lazy(() => import("@/view/auth/ForgotPassword")),
    authority: [],
  },
  {
    key: "resetPassword",
    path: "/reset-password",
    component: lazy(() => import("@/view/auth/ResetPassword")),
    authority: [],
  },

  
];

export default authRoute;
