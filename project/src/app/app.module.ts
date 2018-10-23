import { CreateDeterministicAccountComponent } from './components/createDeterministicAccount/createDeterminsticAccount.component';
import { CreateDelegatedNotarizationComponent } from './components/createDelegatedNotarization/createDelegatedNotarization.component';
import { GetNotarizationComponent } from './components/getNotarization/getNotarization.component';
import { NotarizationService } from './services/notarization.service';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ngfModule } from "angular-file"
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {TransactionService} from "./services/transaction.service";
import {FormatTransactionPipe} from "./pipes/formatTransactions.pipe";
import { ConstantsService } from './services/constants.service';
import { CreateNotarizationComponent } from './components/createNotarization/createNotarization.component';
import {CreateMultisigAccountComponent} from "./components/createMultisigAccount/createMultisigAccount.component";
import {CreateCosignedNotarizationComponent} from "./components/createCosignedNotarization/createCosignedNotarization.component";
import {EditMultisigAccountComponent} from "./components/editMultisigAccount/editMultisigAccount.component";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormatTransactionPipe,
    CreateNotarizationComponent,
    GetNotarizationComponent,
    CreateDeterministicAccountComponent,
    CreateMultisigAccountComponent,
    CreateCosignedNotarizationComponent,
    CreateDelegatedNotarizationComponent,
    EditMultisigAccountComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ngfModule
  ],
  providers: [TransactionService, ConstantsService, NotarizationService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
