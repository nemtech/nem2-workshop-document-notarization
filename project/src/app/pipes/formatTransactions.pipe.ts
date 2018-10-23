import {Pipe, PipeTransform} from '@angular/core';
import {TransactionService} from "../services/transaction.service";
import {Transaction} from "nem2-sdk";


@Pipe({name: 'formatTransaction'})
export class FormatTransactionPipe implements PipeTransform {
  transform(transaction: Transaction): string {
    const transactionService = new TransactionService();
    return transactionService.formatTransactionToFilter(transaction);
  }
}
