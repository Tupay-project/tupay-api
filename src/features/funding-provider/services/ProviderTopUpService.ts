/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { FundingProvider } from '../entities/provider.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config'; // Para obtener las variables de entorno
import { envs } from 'src/shared/config';
import { Request,Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { AddProviderFundsDto } from '../dto/AddProviderFundsDto';

@Injectable()
export class ProviderTopUpService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(FundingProvider)
    private readonly providerRepository: Repository<FundingProvider>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    private readonly configService: ConfigService,
    private readonly httpService: HttpService, // Aseguramos que HttpService está inyectado correctamente
  ) {
    this.stripe = new Stripe(envs.STRIPE_SECRET_KEY);
  }

// async initiateTopUp(providerId: string, amount: number): Promise<{ paymentLink: string; paymentReference: string }> {
//   // Busca el proveedor en la base de datos
//   const provider = await this.providerRepository.findOne({ where: { id: providerId } });

//   if (!provider) {
//     throw new Error('Proveedor no encontrado');
//   }
  
//   console.log('Provider data:', provider);
//   console.log('Amount to charge:', amount);

//   // Generar la referencia de pago
//   const paymentReference = 'REF-' + Date.now();
//   console.log('Generated Payment Reference:', paymentReference);

//   // Crear la transacción en estado pendiente
//   const transaction = this.transactionRepository.create({
//     provider,
//     amount,
//     type: 'credit',
//     status: 'pending',
//     paymentReference,
//   });

//   await this.transactionRepository.save(transaction);

//   // Crear la sesión de pago en Stripe
//   const session = await this.stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'Recarga de Fondos',
//           },
//           unit_amount: amount * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'http://localhost:5000/api/v1/webhook/providers/success?session_id={CHECKOUT_SESSION_ID}',
//     cancel_url: 'http://localhost:5000/api/v1/webhook/providers/cancelled',
//     metadata: {
//       providerId, // Enviar el ID del proveedor como parte de la metadata
//       paymentReference, // Enviar la referencia de pago como metadata
//     },
//   });

//   return {
//     paymentLink: session.url,
//     paymentReference,
//   };
// }


// async stripeWebHoook(req:Request,res:Response){
//   const sig = req.headers['stripe-signature']; 

//   let event:Stripe.Event

//   // TESTEO
//   // const endpoint_secret = 'whsec_e964d6f859b08d9663f02ac2dd91621d8d4e86e1100f660624e03e7c2f39e70d'
//   // PROD
//   const endpoint_secret = 'whsec_TOoBfuJ9aJN8XfqUmfcIdSVqjMQljAug'
//  try {
//   event = this.stripe.webhooks.constructEvent(req['rawBody'],sig,endpoint_secret)
//  } catch (error) {
//    res.status(400).send(`webhook Error: ${error.message}`)
//    return
//  }

//  console.log({event})


//  switch(event.type){
//   case 'charge.succeeded':
//       const chargeSucceeded = event.data.object as Stripe.Charge;

//       const metadata = chargeSucceeded.metadata;
//       console.log('llegando====>metadata',metadata)

//       console.log({
//         providerId: metadata.providerId,  // Acceso a providerId en metadata
//         paymentReference: metadata.paymentReference,  // Acceso a paymentReference en metadata
//       });

//       const transaction = await this.transactionRepository.findOne({
//         where: { paymentReference: metadata.paymentReference },
//       });

//       if (transaction) {
//         transaction.status = 'success';
//         await this.transactionRepository.save(transaction);

//         // Actualizar el saldo del proveedor
//         const provider = await this.providerRepository.findOne({ where: { id: metadata.providerId } });
//         if (provider) {
//           provider.availableFunds += transaction.amount;
//           await this.providerRepository.save(provider);
//         }
//       } else {
//         console.log('No se encontró la transacción.');
//       }


//     break
//     default:
//       console.log('evento no controlado ');

//  }

//  return res.status(200).json({ success: true });
// }

  // Crea una transacción de recarga pendiente
  
  async initiateTopUp(addProviderFundsDto: AddProviderFundsDto) {
    const { amount, providerId, currency } = addProviderFundsDto;
  
    // Generar la referencia de pago
    const paymentReference = 'REF-' + Date.now(); // Asegúrate de generar la referencia aquí
    console.log('Generated Payment Reference:', paymentReference);
  
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          providerId: providerId, // Usar el providerId del DTO
          paymentReference: paymentReference, // Usar la referencia generada
        },
      },
      line_items: [
        {
          price_data: {
            currency: currency, // Usar la moneda del DTO
            product_data: {
              name: 'Recarga de Fondos', // Nombre del producto
            },
            unit_amount: Math.round(amount * 100), // Convertir a centavos
          },
          quantity: 1, // Siempre una sola transacción
        },
      ],
      mode: 'payment', // Modo de pago
     success_url: 'http://localhost:5000/api/v1/webhook/providers/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5000/api/v1/webhook/providers/cancelled',
    });
  
    // Retornar el enlace de pago y la referencia de pago
    return {
      paymentLink: session.url,
      paymentReference, // Retornar la referencia de pago generada
    };
  }
  
  
  
  // async stripeWebHoook(req: Request, res: Response) {
  //   const sig = req.headers['stripe-signature'];

  //   let event: Stripe.Event;
  //   const endpointSecret = 'whsec_TOoBfuJ9aJN8XfqUmfcIdSVqjMQljAug'; // Reemplaza por tu secret de Stripe

  //   try {
  //     event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
  //   } catch (error) {
  //     res.status(400).send(`Webhook Error: ${error.message}`);
  //     return;
  //   }

  //   console.log('Received event:', event);

  //   if (event.type === 'charge.succeeded') {
  //     const chargeSucceeded = event.data.object as Stripe.Charge;
  //     const metadata = chargeSucceeded.metadata;

  //     console.log('Metadata received:', metadata);

  //     const paymentReference = metadata.paymentReference;
  //     const providerId = metadata.providerId;

  //     if (!paymentReference || !providerId) {
  //       console.error('Faltan datos en la metadata.');
  //       return res.status(400).json({ error: 'Faltan datos en la metadata.' });
  //     }

  //     // Buscar la transacción en la base de datos
  //     const transaction = await this.transactionRepository.findOne({ where: { paymentReference } });

  //     if (transaction) {
  //       // Actualizar el estado de la transacción a 'success'
  //       transaction.status = 'success';
  //       await this.transactionRepository.save(transaction);

  //       // Actualizar el saldo del proveedor
  //       const provider = await this.providerRepository.findOne({ where: { id: providerId } });
  //       if (provider) {
  //         provider.availableFunds += transaction.amount;
          
  //         await this.providerRepository.save(provider);
  //         console.log(`Saldo actualizado: ${provider.availableFunds}`);
  //       } else {
  //         console.log('Proveedor no encontrado.');
  //       }
  //     } else {
  //       console.log('Transacción no encontrada.');
  //     }
  //   } else {
  //     console.log('Evento no controlado:', event.type);
  //   }

  //   return res.status(200).json({ success: true });
  // }

  async stripeWebHoook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Real
    const endpointSecret = 'whsec_TOoBfuJ9aJN8XfqUmfcIdSVqjMQljAug'; 

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    switch( event.type ) {
      case 'charge.succeeded': 
        const chargeSucceeded = event.data.object;
        // TODO: llamar nuestro microservicio
        console.log({
          metadata: chargeSucceeded.metadata,
        });
      break;
      
      default:
        console.log(`Event ${ event.type } not handled`);
    }

    return res.status(200).json({ sig });
  }
  
  
  async createTopUpTransaction(providerId: string, amount: number): Promise<void> {
    // Aquí irá la lógica para crear la transacción de recarga
  }

  // Genera un enlace de pago utilizando Stripe
  async generatePaymentLink(providerId: string, amount: number): Promise<string> {
    // Aquí irá la lógica para generar el enlace de pago
    return 'stripe_payment_link'; // Retornar el enlace de Stripe
  }

  // Procesa el webhook de Stripe cuando el pago se completa
// Procesa el webhook de Stripe cuando el pago se completa
async handleTopUpWebhook(webhookData: any): Promise<void> {
  const event = webhookData;

  // Verificar que el evento sea 'checkout.session.completed'
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Buscar la transacción en la base de datos usando la referencia de pago
    const transaction = await this.transactionRepository.findOne({
      where: { paymentReference: session.payment_intent }
    });

    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }

    // Marcar la transacción como 'success'
    transaction.status = 'success';
    await this.transactionRepository.save(transaction);

    // Actualizar el saldo del proveedor
    const provider = await this.providerRepository.findOne({ where: { id: transaction.provider.id } });
    provider.availableFunds += transaction.amount;
    await this.providerRepository.save(provider);
  }
}

  // Actualiza el saldo del proveedor una vez confirmada la recarga
  async updateProviderBalance(providerId: string, amount: number): Promise<void> {
    // Aquí irá la lógica para actualizar el saldo del proveedor
  }

  // Confirma que la recarga de fondos ha sido exitosa
  async confirmTopUp(paymentReference: string): Promise<void> {
    // Buscar la transacción basada en la referencia de pago
    const transaction = await this.transactionRepository.findOne({
      where: { paymentReference, status: 'pending' },
      relations: ['provider'],  // Asegúrate de incluir la relación con el proveedor
    });

    if (!transaction) {
      throw new Error('Transaction not found or already processed');
    }

    // Actualizar el saldo del proveedor
    transaction.provider.availableFunds += transaction.amount;

    // Marcar la transacción como completada
    transaction.status = 'completed';

    // Guardar los cambios en la base de datos
    await this.providerRepository.save(transaction.provider);
    await this.transactionRepository.save(transaction);
  }
}
