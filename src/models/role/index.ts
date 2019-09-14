import * as mongoose from 'mongoose';

import { IRole } from './interface';

export {
  IRole,
}

export interface IRoleDocument extends IRole, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoleModel extends mongoose.Model<IRoleDocument> {
  get(code: string): Promise<IRoleDocument | null>;
  getOrCreate(query: any): Promise<IRoleDocument>;
}

const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  code: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  scope: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// @index
schema.index({ name: 1 }, { unique: true });
schema.index({ code: 1 }, { unique: true });

// @middleware

// @method

// @static
schema.static('get', async function (code: string) {
  return this.findOne({ code });
});

schema.static('getOrCreate', async function (query: any) {
  const instance = await this.findOne(query);

  return instance ? instance : this.create(query);
});

export const Model = mongoose.model<IRoleDocument, IRoleModel>('Role', schema);