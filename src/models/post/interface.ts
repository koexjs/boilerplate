import { IUser } from "@models/user";

export interface IPost {
  id: string;
  author: IUser;
  date: Date;
  dateGmt: Date;
  title: string;
  excerpt: string;
  content: string;
  status: boolean;
  //
  shortName: string;
  password: string;
  modified: Date;
  modifiedGmt: Date;
  parent: IPost;
  guid: string;
  type: string; // post page
  mimeType: string;
  commentStatus: boolean;
  commentCount: number;
}