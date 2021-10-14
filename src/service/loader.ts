import fs from 'fs';
import path from 'path';
import { fromSrc } from '../lib/pathUtil';

async function loadModulesDir(dir: string) {
  const dirname = path.resolve(fromSrc(), dir);
  const files = fs.readdirSync(dirname).map(file => path.join(dirname, file));
  console.log(`loading files: ${dir}`);
  await Promise.all(files.map(file => import(file)));
  console.log(`files loaded: ${dir}`);
}

export default {
  loadModulesDir,
};
