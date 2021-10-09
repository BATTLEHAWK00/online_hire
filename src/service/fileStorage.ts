import { Client, ItemBucketMetadata } from 'minio';
import { Readable } from 'stream';
import configProvider, { ModuleConfig } from '../lib/configProvider';

let fileStorageConfig: FileStorageConfig | null = null;

interface FileStorageConfig extends ModuleConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  region: string;
}

const DefaultConfig: FileStorageConfig = {
  endPoint: 'localhost',
  port: 9050,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'adminadmin',
  bucketName: 'online-hire',
  region: 'online_hire',
};

let minioClient: Client;

export async function Init() {
  if (!configProvider.moduleConfigExists('fileStorage'))
    configProvider.updateModuleConfig('fileStorage', DefaultConfig);
  fileStorageConfig = <FileStorageConfig>(
    configProvider.getModuleConfig('fileStorage')
  );
  console.log('Configuring fileStorage service..');
  minioClient = new Client({
    endPoint: fileStorageConfig.endPoint,
    port: fileStorageConfig.port,
    useSSL: fileStorageConfig.useSSL,
    accessKey: fileStorageConfig.accessKey,
    secretKey: fileStorageConfig.secretKey,
  });
  if (!(await minioClient.bucketExists(fileStorageConfig.bucketName))) {
    console.log('Creating bucket...');
    await minioClient.makeBucket(
      fileStorageConfig.bucketName,
      fileStorageConfig.region
    );
    console.log('Bucket created.');
  }
}

export class storageService {
  static async put(
    areaName: string,
    objName: string,
    file: Readable | Buffer | string,
    meta?: ItemBucketMetadata
  ) {
    if (!fileStorageConfig) throw new Error();
    await minioClient.putObject(
      fileStorageConfig.bucketName,
      `${areaName}/${objName}`,
      file,
      meta
    );
  }

  static async get(areaName: string, objName: string) {
    if (!fileStorageConfig) throw new Error();
    return await minioClient.getObject(
      fileStorageConfig.bucketName,
      `${areaName}/${objName}`
    );
  }

  static async list(areaName?: string) {
    if (!fileStorageConfig) throw new Error();
    return minioClient.listObjectsV2(
      fileStorageConfig.bucketName,
      areaName,
      true
    );
  }

  static async delete(areaName: string, objName: string) {
    if (!fileStorageConfig) throw new Error();
    return await minioClient.removeObject(
      fileStorageConfig.bucketName,
      `${areaName}/${objName}`
    );
  }
}
