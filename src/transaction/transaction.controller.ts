import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
// import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionIdDto } from './dto/transaction-id.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RoleGuard } from 'src/auth/roles.guard';

@ApiTags('transactions')
@UseGuards(RoleGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  //   @Post()
  //   create(@Body() createTransactionDto: CreateTransactionDto) {
  //     return this.transactionService.create(createTransactionDto);
  //   }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of user transactions',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@GetUser() user: User) {
    return this.transactionService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param() transactionId: TransactionIdDto) {
    const { id } = transactionId;
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction status' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param() transactionId: TransactionIdDto,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const { id } = transactionId;
    return this.transactionService.update(id, updateTransactionDto);
  }
}
