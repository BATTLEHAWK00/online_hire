import path from 'path';
import nunjucks from 'nunjucks';
import fs from 'fs';
import { Express } from 'express';
import registerFilters from '../lib/nunjucksFilters';
import configProvider from '../lib/configProvider';

const systemContext = configProvider.getGlobalConfig().system;
const templatePath: string = path.join(__dirname, '../ui/templates');

const nunjucksEnv = nunjucks.configure(templatePath, {
  autoescape: true,
  watch: process.env.NODE_ENV === 'development',
});

registerFilters(nunjucksEnv);

if (process.env.NODE_ENV === 'production') {
  const manifestPath = path.join(__dirname, '../../dist/manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = fs.readFileSync(manifestPath).toString();
    nunjucksEnv.addGlobal('staticFilesMap', JSON.parse(manifest));
  }
}

nunjucksEnv.addGlobal('globalContext', {
  displayName: systemContext.displayName,
  devMode: process.env.NODE_ENV === 'development',
});

// eslint-disable-next-line import/prefer-default-export
export function registerNunjucks(app: Express) {
  app.set('templates', templatePath);
  app.set('view engine', 'njk');
  nunjucksEnv.express(app);
}
