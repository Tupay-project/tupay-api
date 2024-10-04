// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorageOptions } from 'src/shared/interfaces/cloudinary-storage-options.interface';


// CLOUD_NAME=dzqpacupf
// CLOUD_API_KEY=372698151483913
// CLOUD_API_SECRET=jOQuZp4KIMI_4PhXlG5Z-QNSqVE
cloudinary.config({
  cloud_name: 'dzqpacupf',  
  api_key: '372698151483913',
  api_secret: 'jOQuZp4KIMI_4PhXlG5Z-QNSqVE',
});

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, options?: CloudinaryStorageOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',  // Esto permite subir diferentes tipos de archivos, incluyendo imágenes y PDFs
          folder: options?.folder || 'uploads',  // Si deseas agrupar los archivos en carpetas específicas
          public_id: options?.public_id || file.originalname.split('.')[0],  // Nombre del archivo en Cloudinary
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);  // Devuelve el enlace público del archivo
          }
        },
      );
      stream.end(file.buffer);  // Usamos el buffer del archivo para subirlo a Cloudinary
    });
  }
}
