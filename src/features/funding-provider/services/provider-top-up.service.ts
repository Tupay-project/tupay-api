/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { FundingProvider } from '../entities/provider.entity';
import { Transaction } from 'src/features/manager/entities/transaction.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config'; 
import { envs } from 'src/shared/config';
import { Request,Response } from 'express';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProviderTopUpService {
 
}