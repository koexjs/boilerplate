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
  name: (v: string) => v,
  code: (v: string) => v,
  description: (v: string) => v,
  scope: (v: string) => v,
};

const update = {
  name: (v: string) => v,
  code: (v: string) => v,
  description: (v: string) => v,
  scope: (v: string) => v,
};

export const Query = {
  get,
  retrieve: id,
  update: id,
  delete: id,
  refreshClientSecret: id,
};

export const Mutation = {
  create,
  update,
};