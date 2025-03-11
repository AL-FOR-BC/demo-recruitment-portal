import Loading from "@/components/common/Loading";
import appConfig from "@/configs/app.config";
import { useAppSelector } from "@/store";
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import PublicRoute from "@/components/route/PublicRoute";
import {
  protectedRoutes,
  publicRoutes,
  setupRoutes,
} from "@/configs/routes.config/routes.config";
import AppRoute from "@/components/route/AppRoute";
import SetupProtection from "@/components/auth/SetupProtection";

interface ViewsProps {
  pageContainerType?: "default" | "gutterless" | "contained";
  layout?: "";
}

type AllRoutesProps = ViewsProps;

const { authenticatedEntryPath } = appConfig;

const AllRoutes = (props: AllRoutesProps) => {
  const userAuthority = useAppSelector((state) => state.auth.user.authority);

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />
        {protectedRoutes.map((route, index) => (
          <Route
            key={route.key + index}
            path={route.path}
            element={
              <></>
              // <AuthorityGuard
              //     userAuthority={userAuthority}
              //     authority={route.authority}
              // >
              //     <PageContainer {...props} {...route.meta}>
              //         <AppRoute
              //             routeKey={route.key}
              //             component={route.component}
              //             {...route.meta}
              //         />
              //     </PageContainer>
              // </AuthorityGuard>
            }
          />
        ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
                {...route.meta}
              />
            }
          />
        ))}
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {setupRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <SetupProtection>
                <AppRoute routeKey={route.key} component={route.component} />
              </SetupProtection>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <AllRoutes {...props} />
    </Suspense>
  );
};

export default Views;
