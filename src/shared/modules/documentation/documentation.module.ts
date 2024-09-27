import { Module } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiKeyService } from 'src/features/api-key/api-key.service';
import { InterbankModule } from 'src/features/integrations/interbank/interbank.module';
import { TokuModule } from 'src/features/integrations/toku/toku.module';
import { ManagerModule } from 'src/features/manager/manager.module';

@Module({
  providers: [ApiKeyService],
})
export class DocumentationModule {
  static async setup(app: any) {
    const apiKeyService = app.get(ApiKeyService);

    // ------------ Interbanco Documentation ------------
    app.use('/api/doc/interbank', async (req, res, next) => {
      const authHeader = req.headers.authorization || '';
      const b64auth = authHeader.split(' ')[1] || '';
      const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

      if (!username || !password) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        return res.status(401).send('Authentication required.');
      }

      const fixedUsername = 'admin';
      const fixedPassword = 'secret';
      if (username !== fixedUsername || password !== fixedPassword) {
        return res.status(401).send('Invalid username or password.');
      }

      next();
    });

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

    // ------------ Toku Documentation ------------
    app.use('/api/doc/toku', async (req, res, next) => {
      const authHeader = req.headers.authorization || '';
      const b64auth = authHeader.split(' ')[1] || '';
      const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

      if (!username || !password) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        return res.status(401).send('Authentication required.');
      }

      const fixedUsername = 'toku_user';
      const fixedPassword = 'secret';
      if (username !== fixedUsername || password !== fixedPassword) {
        return res.status(401).send('Invalid username or password.');
      }

      next();
    });

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
    // [TokuModule, ]
    });
    SwaggerModule.setup('api/doc/toku', app, tokuDocument);

    // ------------ Admin Documentation ------------
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

      .addServer('https://sandbox.tupay.finance', 'Staging')
      .addServer('http://localhost:5000', 'local')
      .build();

    const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
      include: [ManagerModule],
    });
    SwaggerModule.setup('api/doc', app, adminDocument);
  }
}


// create a customer
// {
//   "governmentId": "1234551518",
//   "email": "andres55111@example.com",
//   "name": "andres3 Doe1",
//   "phoneNumber": "+1234567899",
//   "id": "f95458e7-bcf1-4e0d-8bfd-ff27cb4a0828"
// }


// create a subscription

// {
//   "productId": "prod-12384",
//   "pacMandateId": "pac-67890",
//   "customer": {
//       "id": "f95458e7-bcf1-4e0d-8bfd-ff27cb4a0828",
//       "governmentId": "1234551518",
//       "email": "andres55111@example.com",
//       "name": "andres3 Doe1",
//       "phoneNumber": "+1234567899"
//   },
//   "id": "e6627860-a958-43ff-a705-ef8ec7e0739b"
// }


// create an invoice
// {
//   "isPaid": false,
//   "isVoid": false,
//   "amount": 150.75,
//   "productId": "prod-12384",
//   "dueDate": "2024-09-30",
//   "linkPayment": "https://payment.link/invoice/12345",
//   "currencyCode": "USD",
//   "metadata": {
//       "notes": "Factura para el mes de septiembre"
//   },
//   "receiptType": "electronic",
//   "idReceipt": "receipt-12345",
//   "source": "web",
//   "disableAutomaticPayment": false,
//   "invoiceExternalId": "INV-67898",
//   "customer": {
//       "id": "f95458e7-bcf1-4e0d-8bfd-ff27cb4a0828",
//       "governmentId": "1234551518",
//       "email": "andres55111@example.com",
//       "name": "andres3 Doe1",
//       "phoneNumber": "+1234567899"
//   },
//   "subscription": {
//       "id": "e6627860-a958-43ff-a705-ef8ec7e0739b",
//       "productId": "prod-12384",
//       "pacMandateId": "pac-67890"
//   },
//   "id": "c22ec01b-3bec-48bd-b330-f0073b7bfe0b"
// }
// proceed to payment by selecting a payment method
// make the payment
