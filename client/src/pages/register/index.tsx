import { AppRoutes } from "@/core/constants/app-routes";
import { useAuthStore } from "@/core/state/auth-store";
import OutsideLayout from "@/layouts/outside-layout";
import { Navigate } from "react-router-dom";
import RegisterForm from "./register-form";


export default function RegisterPage() {
  const isLoggedIn = useAuthStore(({ isLoggedIn }) => isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={AppRoutes.EXERCISES} />;
  }

  return (
    <OutsideLayout>
      <div className="flex h-full">
        <section className="w-full lg:w-1/2 flex items-center">
          <div className="mx-auto grid w-[350px]">
            <div className="mb-8 flex flex-col items-center gap-4">
              <h1 className="text-3xl text-center font-bold">Register</h1>
              <p className="text-muted-foreground text-center">
                Enter your information to create an account
              </p>
            </div>
            <RegisterForm />
          </div>
        </section>
        <section className="hidden lg:flex w-full lg:w-1/2 bg-black justify-center items-center">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url(/register.jpg)" }}
          />
        </section>
      </div>
    </OutsideLayout>
  );
}
