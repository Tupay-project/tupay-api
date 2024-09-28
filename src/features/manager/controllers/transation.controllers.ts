// import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';

// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { Transaction } from 'typeorm';
// import { CreateTransactionDto } from '../dto/CreateTransactionDto';
// import { TransactionService } from '../services/transation.service';

// @ApiTags('Transacciones')
// @Controller('transactions')
// export class TransactionController {
//   constructor(private readonly transactionService: TransactionService) {}

//   @Post('create')
//   @ApiOperation({ summary: 'Crear una transacción' })
//   @ApiResponse({ status: 201, description: 'Transacción creada con éxito' })
//   @ApiResponse({ status: 400, description: 'Datos inválidos' })
//   @ApiResponse({ status: 500, description: 'Error del servidor' })
//   async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
//     try {
//       return await this.transactionService.createTransaction(createTransactionDto);
//     } catch (error) {
//       console.error('Error creando transacción:', error);
//       throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('all')
//   @ApiOperation({ summary: 'Obtener todas las transacciones' })
//   @ApiResponse({ status: 200, description: 'Transacciones obtenidas con éxito' })
//   async findAllTransactions(): Promise<Transaction[]> {
//     return this.transactionService.findAllTransactions();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtener una transacción por ID' })
//   @ApiResponse({ status: 200, description: 'Transacción obtenida con éxito' })
//   @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
//   async findTransactionById(@Param('id') id: string): Promise<Transaction> {
//     try {
//       return await this.transactionService.findTransactionById(id);
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.NOT_FOUND);
//     }
//   }
// }
