import { Component } from '@angular/core';
import { ServiceWorkerService } from './shared/service-worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private sws: ServiceWorkerService) {
    // Remove comments for testing notifications
    // this.sws.initNotification();
  }
}
