import { createContext } from "react";
import { IUserContext } from "./types/user";

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});
