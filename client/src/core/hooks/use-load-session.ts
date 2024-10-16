import { useLocalStorage } from "@uidotdev/usehooks";
import { useAuthStore } from "../state/auth-store";
import { LocalStorageKeys } from "../constants/local-storage-keys";
import { useValidateTokenMutation } from "../api/mutations/use-validate-token-mutation";
import { useEffect } from "react";

export function useLoadSession() {
  const [token] = useLocalStorage(LocalStorageKeys.ACCESS_TOKEN);
  const { mutate, isSuccess } = useValidateTokenMutation(token as string);
  const setIsLoggedIn = useAuthStore(({ setIsLoggedIn }) => setIsLoggedIn);

  useEffect(() => {
    mutate();
  }, [mutate, token]);

  setIsLoggedIn(isSuccess);

}
