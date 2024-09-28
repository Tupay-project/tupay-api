import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InterbankModule } from 'src/features/integrations/interbank/interbank.module';

export class InterbankDocumentation {
  static setup(app: any) {
    const interbancoConfig = new DocumentBuilder()
      .setTitle('Interbanco API')
      .setDescription('Operations related to Interbank transactions.')
      .setVersion('1.0')
      .addTag('interbanco')
      .addServer('https://sandbox.tupay.finance', 'Staging')
      .build();

    const interbancoDocument = SwaggerModule.createDocument(app, interbancoConfig, {
      include: [InterbankModule],
    });

    SwaggerModule.setup('api/doc/interbanco', app, interbancoDocument);
  }
}
