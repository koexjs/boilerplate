interface ID {
  id: string;
}

export namespace Query {
  export interface Get {
    q?: string;
    offset: number;
    limit: number;
    sort?: string | string[];
  }

  export interface Retrieve extends ID {}

  export interface Update extends ID {}

  export interface Delete extends ID {}

  export interface RefreshClientSecret extends ID {}
}

export namespace Muation {
  export interface Create {
    name: string;
    code: string;
    description: string;
  }

  export interface Update extends Create {}
} 