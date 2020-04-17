import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, filename);

    const csvJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const item of csvJson) {
      const { title, type, value, category } = item;

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title,
        type,
        value: Number.parseFloat(value),
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
