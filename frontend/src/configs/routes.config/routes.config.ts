import authRoute from "./authRoute";
// import appsRoute from './appsRoute'
// import uiComponentsRoute from './uiComponentsRoute'
// import pagesRoute from './pagesRoute'
// import authDemoRoute from './authDemoRoute'
// import docsRoute from './docsRoute'
import type { Routes } from "@/@types/routes";
import { lazy } from "react";
import SetupProtection from "@/components/auth/SetupProtection";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes: Routes = [
  // ...appsRoute,
  // ...uiComponentsRoute,
  // ...pagesRoute,
  // ...authDemoRoute,
  // ...docsRoute,
];

export const setupRoutes = [
  {
    key: "setup-access",
    path: "/setup-access",
    component: lazy(() => import("@/view/setup/SetupAccess")),
  },
  {
    key: "setup",
    path: "/setup",
    component: lazy(() => import("@/view/setup/ThemeList")),
  },
  {
    key: "new-setup",
    path: "/setup/new",
    component: lazy(() => import("@/view/setup/ThemeSetup")),
  },
];
