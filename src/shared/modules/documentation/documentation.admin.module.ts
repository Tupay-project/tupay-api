import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ManagerModule } from 'src/features/manager/manager.module';

export class AdminDocumentation {
  static setup(app: any, apiKeyService: any) {
    app.use('/api/doc/sandbox', async (req, res, next) => {
      const authHeader = req.headers.authorization || '';
      const b64auth = authHeader.split(' ')[1] || '';
      const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

      if (!username || !password) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        return res.status(401).send('Authentication required.');
      }

      const user = await apiKeyService.findByUsernameAndPassword(username, password);
      if (!user) {
        return res.status(401).send('Invalid username or password.');
      }

      next();
    });

    const adminConfig = new DocumentBuilder()
      .setTitle('Admin API')
      .setDescription('Operations for managing API keys, authentication, and authorization.')
      .setVersion('1.0')
      .addTag('api-keys')
      .addTag('auth')
      .addTag('Seed')
      .addServer('https://api.tupay.finance', 'Production')
      .addServer('https://sandbox.tupay.finance', 'Staging')
      .build();

    const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
      include: [ManagerModule],
    });

    SwaggerModule.setup('api/doc', app, adminDocument);
  }
}
