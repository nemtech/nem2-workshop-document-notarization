import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Account, Listener, NetworkType} from 'nem2-sdk';
import {isValidPrivateKey} from '../..//validators/nem.validator';
import {NotarizationService} from './../../services/notarization.service';
import * as crypto from "crypto-js";
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
  deterministicAccount: Apostille;

  constructor(private formBuilder: FormBuilder) {
    this.notarizationService = new NotarizationService();
    this.deterministicAccountForm = this.formBuilder.group({
      'privateKey': ['', [Validators.required, isValidPrivateKey]],
    });
  }

  createDeterministicAccount(form, file){
    const account = Account.createFromPrivateKey(form.privateKey, NetworkType.MIJIN_TEST);
    this.deterministicAccount = Apostille.init(file.name, account);
  }

  deleteFile(){
    delete this.file;
  }

  ngOnInit(){}

}
