import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as MinIO from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
  private minioClient: MinIO.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get('storage.endpoint');
    const port = this.configService.get('storage.port');
    const useSSL = this.configService.get('storage.useSSL');
    const accessKey = this.configService.get('storage.accessKey');
    const secretKey = this.configService.get('storage.secretKey');
    this.bucketName = this.configService.get('storage.bucket');

    this.minioClient = new MinIO.Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }

  async onModuleInit() {
    // Ensure bucket exists
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      
      // Set bucket policy for public read (adjust as needed)
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
    }
  }

  async uploadFile(
    file: Buffer | any,
    filename: string,
    contentType: string,
    folder?: string,
  ): Promise<string> {
    // Handle both Buffer and Express.Multer.File
    const fileBuffer = Buffer.isBuffer(file) ? file : (file.buffer || file);
    const fileLength = Buffer.isBuffer(file) ? file.length : (file.buffer?.length || file.length || fileBuffer.length);
    const actualFilename = Buffer.isBuffer(file) ? filename : (file.originalname || filename);
    
    const objectName = folder
      ? `${folder}/${uuidv4()}-${actualFilename}`
      : `${uuidv4()}-${actualFilename}`;

    await this.minioClient.putObject(this.bucketName, objectName, fileBuffer, fileLength, {
      'Content-Type': contentType,
    });

    const endpoint = this.configService.get('storage.endpoint');
    const port = this.configService.get('storage.port');
    const useSSL = this.configService.get('storage.useSSL');
    const protocol = useSSL ? 'https' : 'http';
    const portStr = port === 80 || port === 443 ? '' : `:${port}`;

    return `${protocol}://${endpoint}${portStr}/${this.bucketName}/${objectName}`;
  }

  async deleteFile(objectName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }

  async getPresignedUrl(objectName: string, expiry: number = 3600): Promise<string> {
    return await this.minioClient.presignedGetObject(this.bucketName, objectName, expiry);
  }
}

