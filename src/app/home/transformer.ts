export const login = {
  type: (v: string) => v,
  username: (v: string) => v,
  password: (v: string) => v,
  captcha: (v: string) => v.toLowerCase(),
};

export const logout = {
  username: (v: string) => v,
};

export const register = {
  type: (v: string) => v,
  username: (v: string) => v,
  password: (v: string) => v,
  confirmPassword: (v: string) => v,
  captcha: (v: string) => v.toLowerCase(),
};

export const updateUser = {
  nickname: (v: string) => v,
  avatar: (v: string) => v,
  url: (v: string) => v,
  description: (v: string) => v,
};

export const captcha = {
  type: (v: string) => v,
  value: (v: string) => v,
};

export const updatePassword = {
  password: (v: string) => v,
  newPassword: (v: string) => v,
  confirmPassword: (v: string) => v,
};

export const resetPassword = {
  type: (v: string) => v,
  email: (v: string) => v,
  captcha: (v: string) => v,
  code: (v: string) => v,
  password: (v: string) => v,
  confirmPassword: (v: string) => v,
};
