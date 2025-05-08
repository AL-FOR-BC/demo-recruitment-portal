import useAuth from "@/utils/hooks/useAuth";
import { lazy, Suspense, useMemo } from "react";
import Loading from "@/components/common/Loading";

const Layout = () => {
//   const layoutType = useAppSelector((state) => state.theme.layout.type);
//   console.log("layout", layoutType);
  const { authenticated } = useAuth();

  const AppLayout = useMemo(() => {
    if (authenticated) {
      // return layouts[layoutType]
    }
    return lazy(() => import("./AuthLayout"));
  }, [authenticated]);

  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <Loading loading={true} cover align="center" />
        </div>
      }
    >
      <AppLayout />
    </Suspense>
  );
};

export default Layout;
