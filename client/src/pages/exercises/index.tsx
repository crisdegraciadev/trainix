import { AppRoutes } from '@/core/constants/app-routes';
import { useAuthStore } from '@/core/state/auth-store';
import { useResolutionStore } from '@/core/state/resolution-store';
import TopbarLayout from '@/layouts/topbar-layout';
import { useMediaQuery } from '@uidotdev/usehooks';
import { PropsWithChildren, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ExerciseToolbar from './_components/toolbar';
import ExerciseList from './_components/list';

export default function ExercisesPage() {
  const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);
  const setIsDesktop = useResolutionStore(({ setIsDesktop }) => setIsDesktop);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setIsDesktop(isDesktop);
  }, [isDesktop, setIsDesktop]);

  const PageLayout = ({ children }: PropsWithChildren) => (
    <TopbarLayout>
      <header>
        <h1 className="text-4xl font-semibold">Exercises</h1>
      </header>
      <main className="space-y-4">{children}</main>
    </TopbarLayout>
  );

  if (!isLoggedIn) {
    return <Navigate to={AppRoutes.LOGIN} />;
  }

  return (
    <PageLayout>
      <ExerciseToolbar />
      <ExerciseList />
    </PageLayout>
  );
}
