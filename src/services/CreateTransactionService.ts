// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryService = new CreateCategoryService();
    const categoryObj = await categoryService.execute({ title: category });
    const balance = await transactionRepository.getBalance();
    console.log(balance, value);
    if (value > balance.total && type === 'outcome') {
      throw new AppError('You dont have funds to execute this operation', 400);
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryObj.id,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
