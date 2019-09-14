import * as mongoose from 'mongoose';

import { code } from '@utils/code';

import { IResetPassword } from './interface';

export {
  IResetPassword,
}

export interface IResetPasswordDocument extends IResetPassword, mongoose.Document {
  consume(): Promise<void>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResetPasswordModel extends mongoose.Model<IResetPasswordDocument> {
  produce(email: string): Promise<IResetPasswordDocument>;
  get(email: string, code: string): Promise<IResetPasswordDocument>;
  consume(email: string, code: string): Promise<IResetPasswordDocument | null>;
}

const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
  },
  code: {
    type: String,
    // default: '',
  },
  consumed: {
    type: Boolean,
    default: false,
  },
  consumedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// @index
schema.index({ email: 1, code: 1 }, { unique: true });

// @middleware
schema.pre<IResetPasswordDocument>('save', async function () {
  console.log('isNew: ', this.isNew);

  if (this.isNew) {
    this.code = code();
  }
});

// @method
schema.method('consume', async function () {
  this.consumed = true;
  this.consumedAt = new Date();

  return this.save();
});

// @static
schema.static('produce', async function (email: string) {
  return this.create({ email });
});

schema.static('get', async function (email: string, code: string) {
  return this.findOne({ email, code });
});

schema.static('consume', async function (email: string, code: string) {
  const instance = this.findOne({ email, code });

  if (!instance) return instance;

  if (!instance.consumed) {
    instance.consumed = true;
    instance.consumedAt = new Date();

    return instance.save();
  }

  return null;
});

export const Model = mongoose.model<IResetPasswordDocument, IResetPasswordModel>('ResetPassword', schema);