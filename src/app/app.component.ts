import { Component, Input } from '@angular/core';
import { SocketioService } from '../app/socketio.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TypeCar';
   // This property is bound using its original name.
   @Input('bank') bankName: string;
   // this property value is bound to a different property name
   // when this component is instantiated in a template.
   @Input('account-id') id: string;

   constructor(private socketService: SocketioService) {}

   ngOnInit() {
    // this.socketService.setupSocketConnection();
  }
}
