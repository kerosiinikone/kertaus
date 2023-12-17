import { Dispatch, SetStateAction } from "react";
import { User } from "../../../../shared";

export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}
