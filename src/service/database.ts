import { Db, MongoClient } from 'mongodb';
import configProvider, { ModuleConfig } from '../lib/configProvider';

let connection: MongoClient | null = null;
let database: Db;

export interface DatabaseConfig extends ModuleConfig {
  db_host: string;
  db_port: number;
  db_name: string;
}

const defaultConfig: DatabaseConfig = {
  db_host: 'localhost',
  db_port: 27017,
  db_name: 'online_hire',
};

let db_config: DatabaseConfig | null = null;

export function buildURL(config: DatabaseConfig) {
  return `mongodb://${config.db_host}:${config.db_port}/${config.db_name}`;
}

// MongoDB Setup
export async function ConnectDB() {
  try {
    if (!configProvider.moduleConfigExists('database'))
      configProvider.updateModuleConfig('database', defaultConfig);
    db_config = <DatabaseConfig>configProvider.getModuleConfig('database');
    console.log('Connecting to database...');
    connection = await MongoClient.connect(buildURL(db_config));
    database = connection.db();
    console.log('Database Connected.');
  } catch (err) {
    // console.log(err);
    process.exit(1);
  }
}

export function getColl(coll: string) {
  return database.collection(coll);
}
