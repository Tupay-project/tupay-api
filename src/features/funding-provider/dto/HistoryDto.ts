import { IsOptional, IsDate, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class TransactionHistoryDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
}


export enum InvoiceStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
  }
  
  export class InvoiceHistoryDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;
  
    @IsOptional()
    @IsEnum(InvoiceStatus)
    status?: InvoiceStatus;
  
    @IsOptional()
    @IsString()
    numberAgreement?: string;
  }