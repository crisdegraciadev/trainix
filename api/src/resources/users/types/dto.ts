export type CreateUserDto = {
  username: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;
