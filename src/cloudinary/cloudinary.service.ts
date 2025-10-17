import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'products' }, // organize under 'products'
          (error, result) => {
            if (error) {
              reject(new Error(error.message || 'Failed to upload image'));
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Upload failed'));
            }
          },
        )
        .end(file.buffer);
    });
  }
}
