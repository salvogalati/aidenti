export interface IUser {
  id: string;
  username: string;
  avatar_src: string;
}

export interface IUserContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}
