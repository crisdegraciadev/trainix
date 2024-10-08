import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/core/api/mutations/use-login-mutation';
import { AppRoutes } from '@/core/constants/app-routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(30, 'Password must be less than 30 characters'),
});

export default function LoginForm() {
  const { mutate, isPending  } = useLoginMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="jhon@mail.com"
                  {...field}
                  disabled={isPending}
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex justify-between items-center">
                  <span>Password</span>
                  <a
                    href="#"
                    className="text-sm font-medium underline cursor-pointer hover:no-underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder="••••••••"
                  disabled={isPending}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
          Login
        </Button>
      </form>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          className="underline cursor-pointer hover:no-underline"
          to={AppRoutes.REGISTER}
        >
          Sign up
        </Link>
      </div>
    </Form>
  );
}
