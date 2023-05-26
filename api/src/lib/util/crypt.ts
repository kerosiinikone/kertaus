import { compare, hash } from "bcrypt";

export const hashPassword = async (password: string) => {
  return await hash(password, 10);
};

export const comparePasswords = async (
  password: string,
  inputPassword: string
) => {
  return await compare(password, inputPassword);
};
