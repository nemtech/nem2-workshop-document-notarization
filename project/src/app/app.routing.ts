import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CreateNotarizationComponent } from './components/createNotarization/createNotarization.component';
import { CreateDelegatedNotarizationComponent } from './components/createDelegatedNotarization/createDelegatedNotarization.component';
import { GetNotarizationComponent } from './components/getNotarization/getNotarization.component';
import { CreateDeterministicAccountComponent } from './components/createDeterministicAccount/createDeterminsticAccount.component';
import {CreateMultisigAccountComponent} from "./components/createMultisigAccount/createMultisigAccount.component";
import {CreateCosignedNotarizationComponent} from "./components/createCosignedNotarization/createCosignedNotarization.component";
import {EditMultisigAccountComponent} from "./components/editMultisigAccount/editMultisigAccount.component";

const routes: Routes = [
  {
    path: '',
    component: CreateNotarizationComponent
  },
  {
    path: 'notarization/cosigned/create',
    component: CreateCosignedNotarizationComponent
  },

  {
    path: 'notarization/delegated/create',
    component: CreateDelegatedNotarizationComponent
  },
  {
    path: 'notarization/get',
    component: GetNotarizationComponent
  },
  {
    path: 'account/multisig/create',
    component: CreateMultisigAccountComponent
  },
  {
    path: 'account/multisig/edit',
    component: EditMultisigAccountComponent
  },
  {
    path: 'account/deterministic/create',
    component: CreateDeterministicAccountComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
