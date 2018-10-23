import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {Account, Address, Listener, NetworkType, PlainMessage, TransactionHttp} from 'nem2-sdk';
import {ConstantsService} from "../../services/constants.service";
import {isValidAddress, isValidMessage, isValidPrivateKey} from '../..//validators/nem.validator';
import {NotarizationService} from './../../services/notarization.service';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-create-notarization',
  templateUrl: './createNotarization.component.html',
  styleUrls: ['./createNotarization.component.scss']
})
export class CreateNotarizationComponent implements OnInit {

  listener : Listener;
  transactionHttp : TransactionHttp;
  notarizationForm : FormGroup;
  notarizationService: NotarizationService;
  progress : Object;
  file: File;

  constructor(private formBuilder: FormBuilder) {
    this.notarizationService = new NotarizationService();
    this.listener = new Listener(ConstantsService.listenerURL, WebSocket);
    this.transactionHttp = new TransactionHttp(ConstantsService.nodeURL);
    this.notarizationForm = this.formBuilder.group({
      'privateKey': ['', [Validators.required, isValidPrivateKey]],
      'message' : ['', [Validators.required, isValidMessage]],
      'address' : ['', [Validators.required, isValidAddress]],
    });

  }

  notarize(form) {
    const account = Account.createFromPrivateKey(form.privateKey, NetworkType.MIJIN_TEST);
    const recipient = Address.createFromRawAddress(form.address);
    const message = PlainMessage.create(form.message);

    const notarization = this.notarizationService.createNotarizationTransaction(recipient, message);
    const signedNotarization = account.sign(notarization!);

    this.listener.open().then(() => {

      this.listener
        .status(account.address)
        .pipe(
          filter((transaction) => transaction.hash === signedNotarization.hash)
        )
        .subscribe(errorStatus => {
          this.progress = {'message': errorStatus.status, 'code': 'ERROR'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});

      this.listener
        .confirmed(account.address)
        .pipe(
          filter((transaction) =>
            transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedNotarization.hash)
        )
        .subscribe(ignored => {
          this.progress = {'message': 'Notarization confirmed with hash ' + signedNotarization.hash, 'code': 'CONFIRMED'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});

      this.transactionHttp
        .announce(signedNotarization)
        .subscribe(ignored => {
          this.progress = {'message': 'Notarization announced with hash ' + signedNotarization.hash, 'code': 'UNCONFIRMED'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});
    });
  }

  onFileChange(){
    this.notarizationService
      .readFile(this.file)
      .subscribe( message =>{
        //Todo: apply a hash function to the file content.
        this.notarizationForm.patchValue({'message': message });
        this.notarizationForm.get('message')!.markAsDirty();
      })
  }

  deleteFile(){
    delete this.file;
  }

  ngOnInit(){}

}
