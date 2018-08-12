import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '../models/location.model';
import { Marker } from '../models/marker.model';
import { MyAuthService } from '../../auth/auth.service';

const BACKEND_URL = // 'http://localhost:3000/api/event/';
 'https://arcane-gorge-90547.herokuapp.com/api/event/';

@Injectable({ providedIn: 'root' })
export class EventsService {
  marker: Marker;
  private events: Marker[] = [];
  private newEvent = new Subject<any>();
  private eventUpdated = new Subject<{events: Marker[], eventsCount: number}>();
  location = new Subject<Location>();
  private eventsSub: Subscription;

 constructor(private http: HttpClient, private router: Router, private authService: MyAuthService) {}

 addEvent(event: Marker, image: File) {
   const eventData = new FormData();
   eventData.append('title', event.title);
   eventData.append('description', event.description);
   eventData.append('creator', event.creator);
   eventData.append('startDate', event.startDate.toLocaleString());
eventData.append('endDate', event.endDate.toLocaleString());
eventData.append('lat', event.location.lat.toString());
eventData.append('lng', event.location.lng.toString());
eventData.append('image', image, event.title);
eventData.append('guests', null);
  this.http
    .post<{ message: string; eventId: string }>(BACKEND_URL, eventData)
    .subscribe(responseData => {
      const id = responseData.eventId;
      event.id = id;
      this.events.push(event);
   //   this.newEvent.next([...this.events]);
    });
   }

getEvent(id: string) {
return this.http.get<{_id: string; lat: number; lng: number; title: string; description: string; creator: string,
   startDate: Date, endDate: Date, guests: string[], imagePath: string}>(
  BACKEND_URL + id
);
}

getEventsList(eventsPerPage: number, currentPage: number) {
  const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
  this.http
    .get<{ message: string; events: any, maxEvents: number }>(BACKEND_URL + 'eventslist' + queryParams)
    .pipe(
      map(eventData => {
        console.log(eventData.message);
        return {
         events:  eventData.events.map(event => {
          return {
            location: {lat: event.lat, lng: event.lng},
            title: event.title,
            description: event.description,
            id: event._id,
            creator: event.creator,
            startDate: event.startDate,
            endDate: event.endDate,
            guests: event.guests,
            imagePath: event.imagePath
          };
        }), maxEvents: eventData.maxEvents
      };
})
    )
    .subscribe(transformedEventsData => {
      this.events = transformedEventsData.events;
      this.eventUpdated.next({events: [...this.events], eventsCount: transformedEventsData.maxEvents});
    });
}

getEvents() {
  this.http
    .get<{ message: string; events: any }>(BACKEND_URL)
    .pipe(
      map(eventData => {
        console.log(eventData.message);
        return {
         events: eventData.events.map(event => {
          return {
            location: {lat: event.lat, lng: event.lng},
            title: event.title,
            description: event.description,
            id: event._id,
            creator: event.creator,
            startDate: event.startDate,
            endDate: event.endDate,
            guests: event.guests,
            imagePath: event.imagePath
          };
        })
      };
    })
    )
    .subscribe(transformedEvents => {
      this.events = transformedEvents.events;
      this.newEvent.next([...this.events]);
    });
}

getEventListUpdateListener() {
  return this.eventUpdated.asObservable();
}

getEventUpdateListener() {
  return this.newEvent.asObservable();
}

updateEvent(event: Marker , image: File, eventId: string) {
let eventData: FormData | Marker;
if (typeof image === 'object') {
  eventData = new FormData();
  eventData.append('id', eventId);
  eventData.append('title', event.title);
  eventData.append('description', event.description);
  eventData.append('creator', event.creator);
  eventData.append('startDate', event.startDate.toLocaleString());
eventData.append('endDate', event.endDate.toLocaleString());
eventData.append('lat', event.location.lat.toString());
eventData.append('lng', event.location.lng.toString());
eventData.append('image', image, event.title);
if (event.guests != null) {
eventData.append('guests', event.guests.toString());
} else {
  eventData.append('guests', null);
}
} else {
  eventData = {
    id: eventId,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    creator: event.creator,
    location: event.location,
    imagePath: event.imagePath
  };
}
    this.http
    .put(
      BACKEND_URL + eventId, eventData)
    .subscribe(response => {
      console.log(response);
    });
}

updateEventGuests(id: string, guest: string) {
  this.http
  .put(
  BACKEND_URL + 'updateGuests/' + id, guest).subscribe(response => {
      console.log(response);
    });
}

deleteEvent(eventId: string) {
  return this.http.delete(BACKEND_URL + eventId);
}
}
