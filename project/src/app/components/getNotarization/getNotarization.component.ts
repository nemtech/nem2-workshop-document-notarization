import {ConstantsService} from './../../services/constants.service';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountHttp, NetworkType, PublicAccount, Transaction, TransactionHttp} from 'nem2-sdk';
import {isValidPublicKey} from '../../validators/nem.validator';

@Component({
  selector: 'app-get-notarization',
  templateUrl: './getNotarization.component.html'
})
export class GetNotarizationComponent implements OnInit {

  getAccountForm : FormGroup;
  getTransactionForm : FormGroup;
  accountTransactions : Transaction[];
  transaction : Transaction;
  transactionHttp : TransactionHttp;
  accountHttp : AccountHttp;

  constructor(private formBuilder: FormBuilder) {

    this.transactionHttp = new TransactionHttp(ConstantsService.nodeURL);
    this.accountHttp = new AccountHttp(ConstantsService.nodeURL);

    this.getAccountForm = this.formBuilder.group({
      'publicKey': ['', [Validators.required, isValidPublicKey]]
    });

    this.getTransactionForm = this.formBuilder.group({
      'hash': ['', [Validators.required]]
    });

  }

  getTransaction(form){
      delete this.transaction;
      this.transactionHttp
      .getTransaction(form.hash)
      .subscribe( transaction => {
        this.transaction = transaction;
      }, err => this.getTransactionForm.setErrors({'noTransactions': true}));
  }

  getAccountTransactions(form){
      this.accountTransactions = [];
      const publicAccount = PublicAccount.createFromPublicKey(form.publicKey, NetworkType.MIJIN_TEST);
      this.accountHttp
      .transactions(publicAccount)
      .subscribe(
        transactions => {
        this.accountTransactions = transactions;
        if (this.accountTransactions.length == 0) this.getAccountForm.setErrors({'noTransactions': true});
      },
      err => this.getAccountForm.setErrors({'noTransactions': true})
      );
  }

  ngOnInit(){}

}
