import userModel from '../models/user';
import { sha1 } from '../lib/crypto';

// eslint-disable-next-line import/prefer-default-export
export async function Init() {
  if (!(await userModel.getAdminList()).length) {
    const digest = sha1('admin');
    await userModel.createUser({
      userName: 'admin',
      passwd: digest.cipher,
      salt: digest.salt,
      email: 'admin@local',
      role: 'admin',
    });
    console.log('created default user. username: admin, password: admin');
  }
}
