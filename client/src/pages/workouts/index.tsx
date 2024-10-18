import { AppRoutes } from "@/core/constants/app-routes";
import { useAuthStore } from "@/core/state/auth-store";
import { useResolutionStore } from "@/core/state/resolution-store";
import TopbarLayout from "@/layouts/topbar-layout";
import { useMediaQuery } from "@uidotdev/usehooks";
import { PropsWithChildren, useEffect } from "react";
import { Navigate } from "react-router-dom";
import WorkoutToolbar from "./components/toolbar";
import WorkoutList from "./components/list";

export default function WorkoutsPage() {
  const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);
  const setIsDesktop = useResolutionStore(({ setIsDesktop }) => setIsDesktop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setIsDesktop(isDesktop);
  }, [isDesktop, setIsDesktop]);

  const PageLayout = ({ children }: PropsWithChildren) => (
    <TopbarLayout>
      <header>
        <h1 className="text-4xl font-semibold">Workouts</h1>
      </header>
      <main className="space-y-4">{children}</main>
    </TopbarLayout>
  );

  if (!isLoggedIn) {
    return <Navigate to={AppRoutes.LOGIN} />;
  }

  return (
    <PageLayout>
      <WorkoutToolbar />
      <WorkoutList />
    </PageLayout>
  );
}
