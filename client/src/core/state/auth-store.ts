import { create } from 'zustand';
import { UserDTO } from '../types';

export type User = UserDTO;

type AuthStore = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLogged: boolean) => void;
  user: User | null;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: (isLoggedIn) => set((state) => ({ ...state, isLoggedIn })),
}));
