// declare module 'koa' {
//   interface Request {
//     body: any;
//   }
// }

// declare module 'mongoose' {
//   interface Timestamps {
//     createdAt: Date;
//     updatedAt: Date;
//   }

//   export interface Conditions<T extends object> extends Timestamps {

//   }
  
//   export type Projection<T> = {
//     [P in keyof T]?: 0 | 1;
//   }
  
//   export interface Options {
//     skip: number;
//     limit: number;
//     sort: [];
//   }
// }