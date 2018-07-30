import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Marker } from '../models/marker.model';

@Injectable()
export class NotificationsService {
    constructor(private http: HttpClient, private swPush: SwPush) {}
    sub: PushSubscription;
    readonly VAPID_PUBLIC_KEY = 'BFsjeYO7F2jfDBJYF8fhGGWK1knggiFN8uxEpslVLgBw5i5VNQlPan7s-jNw-NAR4L-DQo0_YWZfov1EkCxbyHI';

     addPushSubscriber(sub: any) {
         return this.http.post('https://arcane-gorge-90547.herokuapp.com/api/notification/add', sub);
     }

     send(event: Marker) {
      return this.http.post<{ message: string; title: string }>('https://arcane-gorge-90547.herokuapp.com/api/notification/send', event)
      .subscribe();
  }

     subscribeToNotifications() {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
        this.sub = sub;
        console.log('Notification Subscription: ', sub);
        this.addPushSubscriber(sub).subscribe(
            () => console.log('Sent push subscription object to server.'),
            err =>  console.log('Could not send subscription object to server, reason: ', err)
        );
    })
    .catch(err => console.error('Could not subscribe to notifications', err));
   }

   sendNotifications(event: Marker) {
    console.log('Sending notifications to all Subscribers ...');
    this.send(event);
}
}
