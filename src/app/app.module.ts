import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment'

//socket service
import { SocketioService } from '../app/socketio.service'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankComponent } from './bank/bank.component';
import { HomeComponent } from './home/home.component';
import { SiginComponent } from './sigin/sigin.component';
import { PlayComponent } from './play/play.component';
import { TyperacerComponent } from './typeracer/typeracer.component';
import { RoomComponent } from './room/room.component';


@NgModule({
  declarations: [
    AppComponent,
    BankComponent,
    HomeComponent,
    SiginComponent,
    PlayComponent,
    TyperacerComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // 3. Initialize
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
