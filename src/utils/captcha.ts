import generate from 'nanoid/generate';

const BASESTR = '123456789';

export function captcha() {
  return generate(BASESTR, 6);
}