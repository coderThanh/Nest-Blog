import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

import { SWAGGER_JWT_AUTH } from 'src/common/constant/ultil';

export function setupSwagger(app: INestApplication): void {
  // Nếu là môi trường Production thì không khởi tạo Swagger
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const logger = new Logger('SwaggerConfig');

  // --- CẤU HÌNH SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Tài liệu API hệ thống')
    .setVersion('1.0.0')
    // Cấu hình JWT Authentication toàn cục trên Swagger UI
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT Token để xác thực các API hệ thống',
        in: 'header',
      },
      SWAGGER_JWT_AUTH, // Key định danh cho Bearer Auth (dùng trong @ApiBearerAuth)
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Endpoint truy cập tài liệu: http://localhost:3000/docs/client
  SwaggerModule.setup('docs/client', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Giữ lại Token sau khi F5 trang Swagger
      docExpansion: 'none', // Thu gọn các nhóm API mặc định khi vào trang
      filter: true, // Bật thanh tìm kiếm nhanh các endpoint
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    logger.log(`📱 Client API Docs: http://localhost:${port}/docs/client`);
  }
}
