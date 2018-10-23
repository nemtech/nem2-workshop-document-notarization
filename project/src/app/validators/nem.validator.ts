import {Account, Address, NetworkType, PublicAccount} from 'nem2-sdk';
import { AbstractControl } from '@angular/forms';

export function isValidAddress(control: AbstractControl) {
  let isValid = true;
  try {
    const address = Address.createFromRawAddress(control.value);
    if (address.networkType !== NetworkType.MIJIN_TEST) {
      isValid = false;
    }
  } catch {
    isValid = false;
  }
  return isValid ? null : {invalidAddress : true};
}


export function isValidMessage(control: AbstractControl) {
  let isValid = true;
  if (control.value.length > 1024) {
    isValid = false;
  }
  return isValid ? null : {invalidMessage : true};
}

export function isValidPrivateKey(control: AbstractControl) {
  let isValid = true;

  try {
    Account.createFromPrivateKey(control.value, NetworkType.MIJIN_TEST);
  } catch {
    isValid = false;
  }
  return isValid ? null : {invalidPrivateKey : true};

}


export function isValidPublicKey(control: AbstractControl) {
  let isValid = true;

  try {
    PublicAccount.createFromPublicKey(control.value, NetworkType.MIJIN_TEST);
  } catch {
    isValid = false;
  }
  return isValid ? null : {invalidPublicKey : true};

}
