import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { IUser } from './interface';

import { _throw } from '@utils/index';
import { key } from '@utils/key';

const SALT_WORK_FACTORY = 10;

export {
  IUser,
}

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(password: string): Promise<boolean>;
  updatePassword(password: string, newPassword: string): Promise<boolean>;
  resetPassword(): Promise<boolean>;
  setPassword(password: string): Promise<void>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  get(username: string): Promise<IUserDocument | null>;
  getUser(username: string, password: string): Promise<IUserDocument>;
  getUserByEmail(email: string, password: string): Promise<IUserDocument>;
  getOrCreate(query: any): Promise<IUserDocument>;
}

const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: 'member',
  },
  active: {
    type: Boolean,
    default: true,
  },
  activationKey: {
    type: String,
    default: key(), // @TODO
  },
  nickname: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: 'https://s.gravatar.com/avatar/1326d11854351deb46c0d35712e5aa0f?s=80',
  },
  url: {
    type: String,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// @index
schema.index({ username: 1 }, { unique: true });

// @middleware
schema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTORY);
  this.password = await bcrypt.hash(this.password, salt);

  await next();
});

// @method
schema.method('comparePassword', async function(password: string) {
  return bcrypt.compare(password, this.password);
});

schema.method('updatePassword', async function(password: string, newPassword: string) {
  const isMatched = await this.comparePassword(password);

  if (!isMatched) {
    return _throw(400, '原密码不正确');
  }

  this.password = newPassword;

  return this.save();
});

schema.method('resetPassword', async function() {
  this.password = '@zero1234';
  return this.save();
});

schema.method('setPassword', async function(password: string) {
  this.password = password;
  return this.save();
});

// @static
schema.static('get', async function (username: string) {
  return this.findOne({ username });
});

schema.static('getUser', async function (username: string, password: string) {
  const user: IUserDocument = await this.findOne({ username });

  if (!user) {
    _throw(400, 'user doesnot exist');
  }

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    _throw(400, 'password doesnot matched');
  }

  return user;
});

schema.static('getUserByEmail', async function (email: string, password: string) {
  const user: IUserDocument = await this.findOne({ email });

  if (!user) {
    _throw(400, 'user doesnot exist');
  }

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    _throw(400, 'password doesnot matched');
  }

  return user;
});

schema.static('getOrCreate', async function (query: any) {
  const user = await this.findOne(query);

  return user ? user : this.create(query);
});

export const Model = mongoose.model<IUserDocument, IUserModel>('User', schema);