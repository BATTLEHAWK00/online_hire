import fs from 'fs';
import path from 'path';
import { fromSrc } from '../lib/pathUtil';

async function loadModulesDir(dir: string) {
  const dirname = path.resolve(fromSrc(), dir);
  const files = fs.readdirSync(dirname).map(file => path.join(dirname, file));
  await Promise.all(files.map(file => import(file)));
}

export default {
  loadModulesDir,
};
