import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/entities/user";

type AuthState = {
  user?: User;
};

const initialState: AuthState = {
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (_state, action: PayloadAction<User>) => {
      const { payload } = action;
      return { user: { ...payload } };
    },
  },
});

export default authSlice.reducer;

export const { setCurrentUser } = authSlice.actions;
