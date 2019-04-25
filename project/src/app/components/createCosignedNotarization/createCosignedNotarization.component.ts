import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {filter, mergeMap} from 'rxjs/operators';
import {
  Account,
  AggregateTransaction,
  Deadline,
  Listener,
  LockFundsTransaction,
  Mosaic,
  NamespaceHttp,
  NetworkCurrencyMosaic,
  NetworkType,
  PlainMessage,
  PublicAccount,
  TransactionHttp,
  UInt64,
} from 'nem2-sdk';
import {ConstantsService} from "../../services/constants.service";
import {isValidMessage, isValidPrivateKey, isValidPublicKey} from '../..//validators/nem.validator';
import {NotarizationService} from './../../services/notarization.service';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-create-cosigned-notarization',
  templateUrl: './createCosignedNotarization.component.html',
  styleUrls: ['./createCosignedNotarization.component.scss']
})
export class CreateCosignedNotarizationComponent implements OnInit {

  listener: Listener;
  transactionHttp: TransactionHttp;
  namespaceHttp: NamespaceHttp;
  notarizationForm: FormGroup;
  notarizationService: NotarizationService;
  progress: Object;
  file: File;

  constructor(private formBuilder: FormBuilder) {
    this.notarizationService = new NotarizationService();
    this.listener = new Listener(ConstantsService.listenerURL, WebSocket);
    this.transactionHttp = new TransactionHttp(ConstantsService.nodeURL);
    this.namespaceHttp = new NamespaceHttp(ConstantsService.nodeURL);
    this.notarizationForm = this.formBuilder.group({
      'privateKey': ['', [Validators.required, isValidPrivateKey]],
      'message': ['', [Validators.required, isValidMessage]],
      'multisigPublicKey': ['', [Validators.required, isValidPublicKey]],
    });

  }

  async notarize(form) {
    const account = Account.createFromPrivateKey(form.privateKey, NetworkType.MIJIN_TEST);
    const multisigPublicAccount = PublicAccount.createFromPublicKey(form.multisigPublicKey, NetworkType.MIJIN_TEST);
    const recipient = multisigPublicAccount.address;
    const message = PlainMessage.create(form.message);

    const notarization = this.notarizationService.createNotarizationTransaction(recipient, message);

    const aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [notarization!.toAggregate(multisigPublicAccount)],
      NetworkType.MIJIN_TEST);

    const signedNotarization = account.sign(aggregateTransaction);
    const mosaicId = await this.namespaceHttp.getLinkedMosaicId(NetworkCurrencyMosaic.NAMESPACE_ID).toPromise();
    const lockFundsTransaction = LockFundsTransaction.create(
      Deadline.create(),
      new Mosaic(mosaicId, UInt64.fromUint(10000000)),
      UInt64.fromUint(480),
      signedNotarization,
      NetworkType.MIJIN_TEST);

    const lockFundsTransactionSigned = account.sign(lockFundsTransaction);

    this.listener.open().then(() => {

      this.listener
        .confirmed(account.address)
        .pipe(
          filter((transaction) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash),
          mergeMap(ignored => this.transactionHttp.announceAggregateBonded(signedNotarization))
        )
        .subscribe(ignored => this.progress = {'message': 'Locks funds transaction confirmed', 'code': 'UNCONFIRMED'},
          err => this.progress = {'message': err, 'code': 'ERROR'});

      this.listener
        .status(account.address)
        .pipe(
          filter((transaction) => transaction.hash === signedNotarization.hash
            || transaction.hash === lockFundsTransactionSigned.hash)
        )
        .subscribe(errorStatus => {
          this.progress = {'message': errorStatus.status, 'code': 'ERROR'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});

      this.listener
        .aggregateBondedAdded(account.address)
        .pipe(
          filter((transaction) =>
            transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedNotarization.hash)
        )
        .subscribe(ignored => {
          this.progress = {
            'message': "Notarization pending to be cosigned with hash " + signedNotarization.hash,
            'code': 'UNCONFIRMED'
          };
        }, err => this.progress = {'message': err, 'code': 'ERROR'});


      this.listener
        .confirmed(account.address)
        .pipe(
          filter((transaction) =>
            transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedNotarization.hash)
        )
        .subscribe(ignored => {
          this.progress = {
            'message': 'Notarization confirmed with hash ' + signedNotarization.hash,
            'code': 'CONFIRMED'
          };
        }, err => this.progress = {'message': err, 'code': 'ERROR'});

      this.transactionHttp
        .announce(lockFundsTransactionSigned)
        .subscribe(ignored => this.progress = {'message': 'Lock funds transaction announced', 'code': 'UNCONFIRMED'},
          err => this.progress = {'message': err, 'code': 'ERROR'});
    });
  }

  onFileChange() {
    this.notarizationService
      .readFile(this.file)
      .subscribe(message => {
        this.notarizationForm.patchValue({'message': crypto.SHA256(message).toString(crypto.enc.Hex)});
        this.notarizationForm.get('message')!.markAsDirty();
      })
  }

  deleteFile() {
    delete this.file;
  }

  ngOnInit() {
  }

}
