import { Role } from "../enums/role";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
};
