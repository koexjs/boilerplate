export interface ID {
  id: string;
}

export interface Get {
  q?: string;
  offset: number;
  limit: number;
  sort?: string | string[];
}

export interface Create {
  username: string;
  password?: string;
  role: 'admin' | 'member';
  email?: string;
  active?: boolean;
  nickname?: string;
  avatar?: string;
  url?: string;
  description?: string;
}

export interface Retrieve {
  id: string;
}

export interface Update {
  role: 'admin' | 'member';
  email?: string;
  active?: boolean;
  nickname?: string;
  avatar?: string;
  url?: string;
  description?: string;
}

export interface Delete {
  id: string;
}
