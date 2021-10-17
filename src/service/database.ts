import { Db, MongoClient } from 'mongodb';
import configProvider, { ModuleConfig } from '../lib/configProvider';

let connection: MongoClient | null = null;
let database: Db;

export interface DatabaseConfig extends ModuleConfig {
  // eslint-disable-next-line camelcase
  db_host: string;
  // eslint-disable-next-line camelcase
  db_port: number;
  // eslint-disable-next-line camelcase
  db_name: string;
}

const defaultConfig: DatabaseConfig = {
  db_host: 'localhost',
  db_port: 27017,
  db_name: 'online_hire',
};

let dbConfig: DatabaseConfig | null = null;

export function buildURL(config: DatabaseConfig) {
  return `mongodb://${config.db_host}:${config.db_port}/${config.db_name}`;
}

// MongoDB Setup
export async function ConnectDB() {
  try {
    if (!configProvider.moduleConfigExists('database'))
      configProvider.updateModuleConfig('database', defaultConfig);
    dbConfig = <DatabaseConfig>configProvider.getModuleConfig('database');
    console.log('Connecting to database...');
    connection = await MongoClient.connect(buildURL(dbConfig));
    database = connection.db();
    console.log('Database Connected.');
  } catch (err) {
    process.exit(1);
  }
}

export function getColl(coll: string) {
  return database.collection(coll);
}
