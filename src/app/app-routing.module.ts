import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
import { MintComponent } from './components/mint/mint.component';
import { RoadMapComponent } from './components/road-map/road-map.component';
import { TeamComponent } from './components/team/team.component';
import { NFTComponent } from './components/nft/nft.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', component: MintComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
