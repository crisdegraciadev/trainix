import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AppRoutes } from '@/core/constants/app-routes';
import { CircleUser, Menu, Waypoints } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const LINKS = [
  { to: AppRoutes.DASHBOARD, label: 'Dashboard' },
  { to: AppRoutes.EXERCISES, label: 'Exercises' },
  { to: AppRoutes.WORKOUTS, label: 'Workouts' },
  { to: AppRoutes.STATISTICS, label: 'Statistics' },
  { to: AppRoutes.SETTINGS, label: 'Settings' },
];

function Navigation() {
  const Logo = () => (
    <Link
      to="#"
      className="flex items-center gap-2 text-lg font-semibold md:text-base"
    >
      <Waypoints className="h-6 w-6" />
    </Link>
  );

  const Topbar = () => (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Logo />

      {LINKS.map((link) => (
        <Link
          key={uuid()}
          to={link.to}
          className={`${window.location.pathname !== link.to && 'text-muted-foreground'} transition-colors hover:text-foreground`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Logo />

          {LINKS.map((link) => (
            <Link
              key={uuid()}
              to={link.to}
              className={`${window.location.pathname !== link.to && 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  const UserMenu = () => (
    <div className="flex gap-4 ml-auto md:gap-2 lg:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <header className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-10">
      <Topbar />
      <MobileSidebar />
      <UserMenu />
    </header>
  );
}

export default function TopbarLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Navigation />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-4 md:p-10">
        {children}
      </main>
    </div>
  );
}
