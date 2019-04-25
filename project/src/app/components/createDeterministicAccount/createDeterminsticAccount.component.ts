import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Account, NetworkType} from 'nem2-sdk';
import {isValidPrivateKey} from '../..//validators/nem.validator';
import {NotarizationService} from './../../services/notarization.service';
import {Apostille} from "apostille-library";

@Component({
  selector: 'app-create-deterministic-account',
  templateUrl: './createDeterministicAccount.component.html'
})
export class CreateDeterministicAccountComponent implements OnInit {

  deterministicAccountForm : FormGroup;
  progress : string;
  file: File;
  notarizationService: NotarizationService;
  deterministicAccount: Account;

  constructor(private formBuilder: FormBuilder) {
    this.notarizationService = new NotarizationService();
    this.deterministicAccountForm = this.formBuilder.group({
      'privateKey': ['', [Validators.required, isValidPrivateKey]],
    });
  }

  createDeterministicAccount(form, file){
    const account = Account.createFromPrivateKey(form.privateKey, NetworkType.MIJIN_TEST);
    this.deterministicAccount = Apostille.initFromSeed(file.name, account).HDAccount;
  }

  deleteFile(){
    delete this.file;
  }

  ngOnInit(){}

}
