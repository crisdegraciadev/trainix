import { Metadata } from "next";
import { UserLoginForm } from "./components/user-login-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="flex justify-center items-center absolute inset-0 bg-zinc-900">
            <h1 className="text-6xl font-bold ">Trainix</h1>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Login with your account
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to login into
              </p>
            </div>
            <UserLoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
