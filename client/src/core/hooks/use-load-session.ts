import { useLocalStorage } from "@uidotdev/usehooks";
import { useAuthStore } from "../state/auth-store";
import { LocalStorageKeys } from "../constants/local-storage-keys";

export function useLoadSession() {
  const [token] = useLocalStorage(LocalStorageKeys.ACCESS_TOKEN);
  const setIsLoggedIn = useAuthStore(({ setIsLoggedIn }) => setIsLoggedIn);
  setIsLoggedIn(!!token);
}
