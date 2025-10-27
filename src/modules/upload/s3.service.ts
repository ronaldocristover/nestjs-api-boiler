import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME', '');
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<{
    url: string;
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
  }> {
    const fileExtension = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: ObjectCannedACL.public_read,
    });

    await this.s3Client.send(command);

    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const url = `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;

    return {
      url,
      key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads'
  ): Promise<Array<{
    url: string;
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
  }>> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }
}