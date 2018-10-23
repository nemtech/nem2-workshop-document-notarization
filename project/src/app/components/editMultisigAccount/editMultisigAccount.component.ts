import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  Account,
  AggregateTransaction,
  Deadline,
  Listener,
  LockFundsTransaction,
  ModifyMultisigAccountTransaction,
  MultisigCosignatoryModification,
  MultisigCosignatoryModificationType,
  NetworkType,
  PublicAccount,
  TransactionHttp,
  UInt64,
  XEM
} from 'nem2-sdk';
import {isValidPublicKey} from '../../validators/nem.validator';
import {filter, mergeMap} from "rxjs/operators";
import {ConstantsService} from "../../services/constants.service";

@Component({
  selector: 'app-edit-multisig-account',
  templateUrl: './editMultisigAccount.component.html'
})
export class EditMultisigAccountComponent implements OnInit {

  editMultisigForm : FormGroup;
  transactionHttp: TransactionHttp;
  listener : Listener;
  progress : Object;

  constructor(private formBuilder: FormBuilder) {

    this.listener = new Listener(ConstantsService.listenerURL, WebSocket);
    this.transactionHttp = new TransactionHttp(ConstantsService.nodeURL);

    this.editMultisigForm = this.formBuilder.group({
      'privateKey': ['', Validators.required],
      'multisigPublicKey': ['', Validators.required],
      'newCosignatories':
        formBuilder.array([]),
      'deletedCosignatories': formBuilder.array([]),
      'minApprovalDelta': [0, Validators.required],
      'minRemovalDelta': [0, Validators.required]
    });

  }


  createPublicKeyInput() : FormGroup {
    return this.formBuilder.group({
      publicKey : ['', isValidPublicKey]
    });
  }


  addCosignatory() {
    const cosignatories = this.editMultisigForm.get('newCosignatories') as FormArray;
    cosignatories.controls.push(this.createPublicKeyInput());
  }

  deleteCosignatory() {
    const cosignatories = this.editMultisigForm.get('deletedCosignatories') as FormArray;
    cosignatories.controls.push(this.createPublicKeyInput());
  }

  editMultisigAccount(form){
    const account = Account.createFromPrivateKey(form.privateKey, NetworkType.MIJIN_TEST);
    const multisigPublicAccount = PublicAccount.createFromPublicKey(form.multisigPublicKey, NetworkType.MIJIN_TEST);

    const newCosignatories = form.newCosignatories.map( cosignatory => {
      const publicAccount = PublicAccount.createFromPublicKey(cosignatory.publicKey, NetworkType.MIJIN_TEST);
      return new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, publicAccount);
    });

    const deletedCosignatories = form.deletedCosignatories.map( cosignatory => {
      const publicAccount = PublicAccount.createFromPublicKey(cosignatory.publicKey, NetworkType.MIJIN_TEST);
      return new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Remove, publicAccount);
    });

    const modifications = newCosignatories.concat(deletedCosignatories);

    const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
      Deadline.create(),
      form.minApprovalDelta,
      form.minRemoval,
      modifications,
      NetworkType.MIJIN_TEST);

    const aggregateTransaction = AggregateTransaction.createBonded(
      Deadline.create(),
      [modifyMultisigAccountTransaction.toAggregate(multisigPublicAccount)],
      NetworkType.MIJIN_TEST);

    const signedTransaction = account.sign(aggregateTransaction);

    const lockFundsTransaction = LockFundsTransaction.create(
      Deadline.create(),
      XEM.createRelative(10),
      UInt64.fromUint(480),
      signedTransaction,
      NetworkType.MIJIN_TEST);

    const lockFundsTransactionSigned = account.sign(lockFundsTransaction);

    this.listener.open().then(() => {

      this.listener
        .confirmed(account.address)
        .pipe(
          filter((transaction) => transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === lockFundsTransactionSigned.hash),
          mergeMap(ignored => this.transactionHttp.announceAggregateBonded(signedTransaction))
        )
        .subscribe(ignored =>  this.progress= {'message':  'Locks funds transaction confirmed', 'code':'UNCONFIRMED'},
          err =>  this.progress = {'message': err, 'code': 'ERROR'});

      this.listener
        .status(account.address)
        .pipe(
          filter((transaction) => transaction.hash === signedTransaction.hash
            || transaction.hash === lockFundsTransactionSigned.hash)
        )
        .subscribe(errorStatus => {
          this.progress =  {'message':  errorStatus.status, 'code':'ERROR'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});

      this.listener
        .aggregateBondedAdded(account.address)
        .pipe(
          filter((transaction) =>
            transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedTransaction.hash)
        )
        .subscribe(ignored => {
          this.progress = {'message':  "Transaction pending to be cosigned with hash " + signedTransaction.hash, 'code':'UNCONFIRMED'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});


      this.listener
        .confirmed(account.address)
        .pipe(
          filter((transaction) =>
            transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedTransaction.hash)
        )
        .subscribe(ignored => {
          this.progress = {'message': 'Transaction confirmed with hash ' + signedTransaction.hash, 'code':'CONFIRMED'}
        }, err => this.progress = {'message': err, 'code': 'ERROR'});


      this.transactionHttp
        .announce(lockFundsTransactionSigned)
        .subscribe(x => this.progress =  {'message': 'Lock funds transaction announced', 'code':'UNCONFIRMED'},
            err => this.progress = {'message': err, 'code': 'ERROR'});
    });
  }

  ngOnInit(){}

}
