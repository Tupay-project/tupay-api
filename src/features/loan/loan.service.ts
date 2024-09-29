import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity'; // La entidad Loan
import { CreateLoanDto } from './dto/create-loan.dto'; // DTO para la creación de préstamos
import { UpdateLoanDto } from './dto/update-loan.dto'; // DTO para actualizar préstamos

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  /**
   * Crear un nuevo préstamo.
   */
  async createLoan(createLoanDto: CreateLoanDto): Promise<Loan> {
    const loan = this.loanRepository.create(createLoanDto);
    return this.loanRepository.save(loan);
  }

  /**
   * Obtener todos los préstamos.
   */
  async getAllLoans(): Promise<Loan[]> {
    return this.loanRepository.find();
  }

  /**
   * Obtener un préstamo por su ID.
   */
  async getLoanById(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({ where: { id } });
    if (!loan) {
      throw new HttpException('Loan not found', HttpStatus.NOT_FOUND);
    }
    return loan;
  }

  /**
   * Actualizar un préstamo por su ID.
   */
  async updateLoan(id: string, updateLoanDto: UpdateLoanDto): Promise<Loan> {
    const loan = await this.getLoanById(id);
    Object.assign(loan, updateLoanDto);
    return this.loanRepository.save(loan);
  }

  /**
   * Eliminar un préstamo por su ID.
   */
  async deleteLoan(id: string): Promise<void> {
    const loan = await this.getLoanById(id);
    await this.loanRepository.remove(loan);
  }
}
