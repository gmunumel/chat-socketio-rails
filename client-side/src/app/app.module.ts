import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { AboutComponent }          from './components/about/about.component';
import { AppComponent }            from './components/app/app.component';
import { ChatRoomComponent }       from './components/admin/chat-room/chat-room.component';
import { ChatRoomDetailComponent } from './components/admin/chat-room/chat-room-detail.component';
import { DashboardComponent }      from './components/dashboard/dashboard.component';
import { MessageComponent }        from './components/admin/message/message.component';
import { MessageDetailComponent }  from './components/admin/message/message-detail.component';
import { SignInComponent }         from './components/sign-in/sign-in.component';
import { SignUpComponent }         from './components/sign-up/sign-up.component';
import { UserComponent }           from './components/admin/user/user.component';
import { UserDetailComponent }     from './components/admin/user/user-detail.component';
import { UserService }             from './services/user.service';
import { ChatRoomService }         from './services/chat-room.service';
import { MessageService }          from './services/message.service';
import { SocketService }           from './services/socket.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AboutComponent,
    AppComponent,
    ChatRoomComponent,
    ChatRoomDetailComponent,
    DashboardComponent,
    MessageComponent,
    MessageDetailComponent,
    SignInComponent,
    SignUpComponent,
    UserComponent,
    UserDetailComponent,
  ],
  providers: [ UserService, ChatRoomService, MessageService, SocketService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
