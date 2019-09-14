const id = {
  id: (v: string) => v,
};

const get = {
  q: (v: string) => v,
  offset: (v: string) => parseInt(v) || 0,
  limit: (v: string) => parseInt(v) || 10,
  sort: (v: string | string[]) => v,
};

const create = {
  username: (v: string) => v,
  role: (v: string) => v,
  email: (v: string) => v,
  active: (v: boolean) => v,
  nickname: (v: string) => v,
  avatar: (v: string) => v,
  url: (v: string) => v,
  description: (v: string) => v,
};

const retrieve = {
  id: (v: string) => v,
};

const update = {
  role: (v: string) => v,
  active: (v: boolean) => v,
  email: (v: string) => v,
  nickname: (v: string) => v,
  avatar: (v: string) => v,
  url: (v: string) => v,
  description: (v: string) => v,
};

// const updateDoc = {
//   resetToken: (v: string) => v,
// };

const del = {
  id: (v: string) => v,
};

const resetPassword = {
  id: (v: string) => v,
};

export const transformer = {
  id,
  get,
  create,
  retrieve,
  update,
  del,
  resetPassword,
  loginAs: id,
};