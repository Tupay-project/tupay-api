export class EnterBasicDataDto {
    transactionId: number;
    customerData: {
      name: string;
      email: string;
      phoneNumber: string;
    };
  }
  