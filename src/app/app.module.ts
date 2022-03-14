import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeamComponent } from './components/team/team.component';
import { RoadMapComponent } from './components/road-map/road-map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';

import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { StoreModule } from '@ngrx/store';
import { addressReducer } from './store/reducers';
import { HomeComponent } from './components/home/home.component';
import { MintComponent } from './components/mint/mint.component';
import { ManageComponent } from './components/manage/manage.component';
import { NFTComponent } from './components/nft/nft.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    RoadMapComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    MintComponent,
    ManageComponent,
    NFTComponent,
  ],
  imports: [
    StoreModule.forRoot({ address: addressReducer }),
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MdbCollapseModule,
    MdbFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
