import {Observable} from 'rxjs';
import {Injectable} from "@angular/core";
import {Address, Deadline, NetworkType, PlainMessage, TransferTransaction} from "nem2-sdk";

@Injectable()

export class NotarizationService {

  constructor() {

  }

  readFile(file : File) :  Observable<string> {

    return Observable.create(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsText(file);

    });
  }

  createNotarizationTransaction(recipient: Address, message: PlainMessage) : TransferTransaction | undefined {

    //Todo: Create a transfer transaction
    alert('Implement the notarization transaction!');
    return  undefined;
  }
}

