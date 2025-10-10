import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  //   @Post()
  //   create(@Body() createTransactionDto: CreateTransactionDto) {
  //     return this.transactionService.create(createTransactionDto);
  //   }

  @Get()
  findAll(@GetUser() user: User) {
    return this.transactionService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }
}
