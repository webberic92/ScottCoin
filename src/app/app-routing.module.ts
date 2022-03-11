import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ManageComponent } from './manage/manage.component';
import { MintComponent } from './mint/mint.component';
import { RoadMapComponent } from './road-map/road-map.component';
import { TeamComponent } from './team/team.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'roadmap', component: RoadMapComponent },
  { path: 'team', component: TeamComponent },
  { path: 'mint', component: MintComponent },
  { path: 'manage', component: ManageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
