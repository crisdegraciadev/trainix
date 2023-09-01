import axios from "axios";

type LoginArgs = {
  username: string;
  password: string;
};

export const login = async ({ username, password }: LoginArgs) => {
  await axios.post("http://localhost:5000/auth/login", { username, password });
};
