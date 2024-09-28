import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TokuModule } from 'src/features/integrations/toku/toku.module';

export class TokuDocumentation {
  static setup(app: any) {
    const tokuConfig = new DocumentBuilder()
      .setTitle('Toku API')
      .setDescription('Operations related to invoices, customers, subscriptions, and payments.')
      .setVersion('1.0')
      .addTag('invoices')
      .addTag('customers')
      .addTag('subscriptions')
      .addTag('payments')
      .addTag('webhooks')
      .addServer('https://sandbox.tupay.finance', 'Staging')
      .build();

    const tokuDocument = SwaggerModule.createDocument(app, tokuConfig, {
      include: [TokuModule],
    });

    SwaggerModule.setup('api/doc/toku', app, tokuDocument);
  }
}
