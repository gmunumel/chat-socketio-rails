import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';


export class Hero {
    id: number;
    name: string;
}
@Component({
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    <h2>{{hero.name}} details!</h2>
    <div><label>id: </label>{{hero.id}}</div>
    <div>
      <label>name: </label>
      <input [(ngModel)]="hero.name" placeholder="name">
    </div>
    `
})
export class AppComponent {
    private socketService: SocketService;
    title = 'Tour of Heroes';
    hero: Hero = {
        id: 1,
        name: 'Windstorm'
    };

    constructor() {
        this.socketService = new SocketService();
        this.socketService.get();
    }

    // socket: SocketIOClient.Socket;

    // constructor() {}
    //
    // get(): any {
    //     this.socket = io.connect('localhost:5001');
    //
    // }

    //socket: SocketIOClient.Socket;

    // socket.on('users-kist', function(user){
    //     alert('Welcome ' + user);
    // });

}
