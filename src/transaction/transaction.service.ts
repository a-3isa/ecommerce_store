import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
// import { Order } from 'src/order/entities/order.entity';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // @InjectRepository(Order)
    // private orderRepository: Repository<Order>,
  ) {}

  // async create(
  //   createTransactionDto: CreateTransactionDto,
  // ): Promise<Transaction> {
  //   const { userId, orderId, ...transactionData } = createTransactionDto;

  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${userId} not found`);
  //   }

  //   const order = await this.orderRepository.findOne({
  //     where: { id: orderId },
  //   });
  //   if (!order) {
  //     throw new NotFoundException(`Order with ID ${orderId} not found`);
  //   }

  //   const transaction = this.transactionRepository.create({
  //     ...transactionData,
  //     user,
  //     order,
  //   });

  //   return this.transactionRepository.save(transaction);
  // }

  async findAll(user: User): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    Object.assign(transaction, updateTransactionDto);
    await this.transactionRepository.save(transaction);

    const updatedTransaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });

    if (!updatedTransaction) {
      throw new NotFoundException(
        `Transaction with ID ${id} not found after update`,
      );
    }

    return updatedTransaction;
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    await this.transactionRepository.remove(transaction);
  }
}
