import * as mongoose from 'mongoose';

import { IMenu } from './interface';

export {
  IMenu,
}

export interface IMenuDocument extends IMenu, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IMenuModel extends mongoose.Model<IMenuDocument> {
  get(code: string): Promise<IMenuDocument | null>;
  getOrCreate(query: any): Promise<IMenuDocument>;
}

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  children: [{
    type: ObjectId,
    ref: 'Menu',
  }],
  collapsed: {
    type: Boolean,
    default: true,
  },
  sort: {
    type: Number,
    default: -1,
  },
  parent: {
    type: ObjectId,
    ref: 'Menu',
    default: null,
  },
  code: {
    type: String,
    default: null,
  },
  iframe: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// @index
schema.index({ path: 1, parent: 1 }, { unique: true });

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

export const Model = mongoose.model<IMenuDocument, IMenuModel>('Menu', schema);