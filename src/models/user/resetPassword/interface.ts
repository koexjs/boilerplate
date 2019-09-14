export interface IResetPassword {
  email: string;
  code: string;
  consumed: boolean;
  consumedAt: Date;
  createdAt: Date;
}
