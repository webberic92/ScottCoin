import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
import { MintComponent } from './components/mint/mint.component';
import { RoadMapComponent } from './components/road-map/road-map.component';
import { TeamComponent } from './components/team/team.component';
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
