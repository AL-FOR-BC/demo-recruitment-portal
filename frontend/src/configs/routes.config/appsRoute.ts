import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const appsRoute: Routes = [
  {
    key: "profile",
    path: `/profile`,
    component: lazy(() => import("@/view/profile/Profile")),
    authority: [],
  },
  {
    key: "apps.dashboard",
    path: "/dashboard",
    component: lazy(() => import("@/view/dashboard/Dashboard")),
    authority: [],
  },
  {
    key: "apps.createProfile",
    path: `/create-profile`,
    component: lazy(() => import("@/view/profile/CreateProfile")),
    authority: [],
  },
  {
    key: "apps.applicatDetails",
    path: `/applicate-details/:id`,
    component: lazy(() => import("@/view/profile/ApplicationDetails")),
    authority: [],
  },
  {
    key: "apps.jobDetails",
    path: `/job-details/:jobId`,
    component: lazy(() => import("@/view/dashboard/JobDetails")),
    authority: [],
  },
];

export default appsRoute;
