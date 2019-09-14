export type Role = 'admin' | 'member';

export interface IUser {
  username: string;
  password: string;
  resetToken: string;
  resetTokenExpires: Date;
  // 
  role: Role;
  //
  email: string;
  active: boolean;
  activationKey: string;
  //
  nickname: string;
  avatar: string;
  url: string;
  description: string;
}
