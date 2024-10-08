import { Navigate } from 'react-router-dom';
import LoginForm from './login-form';
import { useAuthStore } from '@/core/state/auth-store';
import { AppRoutes } from '@/core/constants/app-routes';
import OutsideLayout from '@/layouts/outside-layout';

export default function LoginPage() {
  const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={AppRoutes.EXERCISES} />;
  }

  return (
    <OutsideLayout>
      <div className="flex h-full">
        <section className="hidden lg:flex w-full lg:w-1/2 bg-black justify-center items-center">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(/login.jpg)' }}
          />
        </section>
        <section className="w-full lg:w-1/2 flex items-center">
          <div className="mx-auto grid w-[350px]">
            <div className="mb-8 flex flex-col items-center gap-4">
              <h1 className="text-3xl text-center font-bold">Login</h1>
              <p className="text-muted-foreground text-center">
                Enter your email below to login to your account
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </OutsideLayout>
  );
}
