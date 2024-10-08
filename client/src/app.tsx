import { useLocalStorage } from '@uidotdev/usehooks';
import { LocalStorageKeys } from './core/constants/local-storage-keys';
import { useAuthStore } from './core/state/auth-store';
import AppProviders from './core/providers';

export default function App() {
  const [token] = useLocalStorage(LocalStorageKeys.ACCESS_TOKEN);
  const setIsLoggedIn = useAuthStore(({ setIsLoggedIn }) => setIsLoggedIn);

  setIsLoggedIn(!!token);

  return <AppProviders />;
}
