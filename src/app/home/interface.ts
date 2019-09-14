export interface Login {
  type?: 'email' | 'tel';
  username: string;
  password: string;
  captcha: string;
}

export interface Logout {
  username: string;
}

export interface Register {
  type: 'email' | 'telphone';
  username: string;
  password: string;
  confirmPassword: string;
  captcha: string;
}

export interface Captcha {
  type: 'image' | 'email' | 'telphone';
  value: string;
}

export interface UpdatePassword {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPassword {
  type: 'email' | 'reset';
  // email
  email?: string;
  captcha?: string;
  // reset
  code?: string;
  password?: string;
  confirmPassword?: string;
}