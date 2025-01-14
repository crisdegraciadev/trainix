import { useFindWorkout } from "@/core/api/queries/use-find-workout";
import { AppRoutes } from "@/core/constants/app-routes";
import { useAuthStore } from "@/core/state/auth-store";
import { useResolutionStore } from "@/core/state/resolution-store";
import TopbarLayout from "@/layouts/topbar-layout";
import { useMediaQuery } from "@uidotdev/usehooks";
import { PropsWithChildren, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import IterationList from "./_components/list";

export default function WorkoutDetailsPage() {
  const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);
  const setIsDesktop = useResolutionStore(({ setIsDesktop }) => setIsDesktop);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { id } = useParams();
  const workoutId = Number(id) ?? 0;

  const { data: workout, isLoading } = useFindWorkout(workoutId);

  useEffect(() => {
    setIsDesktop(isDesktop);
  }, [isDesktop, setIsDesktop]);

  const PageLayout = ({ children }: PropsWithChildren) => (
    <TopbarLayout>
      <header>
        <h1 className="text-4xl font-semibold">{workout?.name}</h1>
      </header>
      <main className="space-y-4">{children}</main>
    </TopbarLayout>
  );

  if (!isLoggedIn) {
    return <Navigate to={AppRoutes.LOGIN} />;
  }

  if (isLoading || !workout) {
    return <p>Loading</p>;
  }

  return (
    <PageLayout>
      <p>Workout details</p>
      <IterationList workoutId={workoutId} />
    </PageLayout>
  );
}
