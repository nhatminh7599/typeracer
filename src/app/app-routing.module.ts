import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BankComponent } from './bank/bank.component';
import { HomeComponent } from './home/home.component';
import { SiginComponent } from './sigin/sigin.component';
import { PlayComponent } from './play/play.component';
import { TyperacerComponent } from './typeracer/typeracer.component';
import { RoomComponent } from './room/room.component';
const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
{ path: 'sigin', component: SiginComponent },
{ path: 'play', component: PlayComponent },
{ path: 'typeracer', component: TyperacerComponent },
{ path: 'room', component: RoomComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
