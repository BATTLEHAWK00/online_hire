import yaml from 'js-yaml';
import fs from 'fs';

function load(filePath: string) {
  return yaml.load(fs.readFileSync(filePath, 'utf-8'));
}

function save(obj: any, filePath: string) {
  fs.writeFileSync(filePath, yaml.dump(obj));
}

export default {
  load,
  save,
};
