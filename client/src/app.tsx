import { useLoadSession } from "./core/hooks/use-load-session";
import AppProviders from "./core/providers";

export default function App() {
  useLoadSession();

  return <AppProviders />;
}
