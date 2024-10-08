import { PropsWithChildren } from 'react';

export default function OutsideLayout({ children }: PropsWithChildren) {
  return <div className="h-screen">{children}</div>;
}
