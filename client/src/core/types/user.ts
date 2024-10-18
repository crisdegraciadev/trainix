export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type RegisterUserDTO = Omit<UserDTO, "id"> & {
  password: string;
  confirmPassword: string;
};
