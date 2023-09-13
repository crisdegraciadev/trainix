import { setCurrentUser } from "../../stores/auth/slice";
import { User } from "../../types/entities/user";
import { useAppDispatch } from "./use-store";

export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const setLoggedUser = (user: User) => {
    dispatch(setCurrentUser(user));
  };

  return { setLoggedUser };
};
