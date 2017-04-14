import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title: string = 'Simple Chat App';

  toggled: string = 'toggled';

  public toggleSidebar():void {
    if (this.toggled === 'toggled') {
       this.toggled = '';
    } else {
       this.toggled = 'toggled';
    }
  }
}
