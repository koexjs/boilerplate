import generate from 'nanoid/generate';

const BASESTR = 'abcdef0123456789';

export function code() {
  return generate(BASESTR, 32);
}