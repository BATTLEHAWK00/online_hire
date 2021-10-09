import crypto from 'crypto';
import { v4 as UUIDv4 } from 'uuid';

// interface PasswdDigest {
//   cipher: string;
//   salt: string;
// }

function encrypt(content: string, salt: string, algorithm: string) {
  return crypto
    .createHash(algorithm)
    .update(content)
    .update(salt)
    .digest('hex');
}

export function md5(content: string, salt?: string) {
  if (!salt) salt = UUIDv4().toString();
  for (let i = 0; i < 3; i++) {
    content = encrypt(content, salt, 'md5');
  }
  return { cipher: content, salt };
}

export function sha1(content: string, salt?: string) {
  if (!salt) salt = UUIDv4().toString();
  for (let i = 0; i < 3; i++) {
    content = encrypt(content, salt, 'sha1');
  }
  return { cipher: content, salt };
}
