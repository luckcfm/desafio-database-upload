import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface TransactionCategory extends Transaction {
  category: Category;
}
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getAll(): Promise<Transaction[]> {
    const transactions = await this.find({ relations: ['category'] });
    console.log(transactions);
    return transactions;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (accumulator, transaction) => {
        accumulator[transaction.type] += parseFloat(
          transaction.value.toString(),
        );
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    balance.total = balance.income - balance.outcome;
    return balance;
  }
}

export default TransactionsRepository;
