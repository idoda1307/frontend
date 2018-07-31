import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '../models/location.model';
import { Marker } from '../models/marker.model';
import { MyAuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  marker: Marker;
  oldMarker: Marker;
  private events: Marker[] = [];
  private newEvent = new Subject<any>();
  private eventUpdated = new Subject<{events: Marker[], eventsCount: number}>();
  location = new Subject<Location>();
  private eventsSub: Subscription;

 constructor(private http: HttpClient, private router: Router, private authService: MyAuthService) {}

 addEvent(title: string, description: string, location: Location, dateStarted: Date, dateEnded: Date) {
const event: Marker = {id: null, location: location , title: title,
   description: description, creator: this.authService.getUserId(), dateStarted: dateStarted, dateEnded: dateEnded, guests: null};
  this.http
    .post<{ message: string; eventId: string }>('https://arcane-gorge-90547.herokuapp.com/api/event/createevent', event)
    .subscribe(responseData => {
      const id = responseData.eventId;
      event.id = id;
      this.events.push(event);
   //   this.newEvent.next([...this.events]);
    });
   }

getEvent(id: string) {
return this.http.get<{_id: string; lat: number; lng: number; title: string; description: string; creator: string,
   dateStarted: Date, dateEnded: Date, guests: string[]}>(
  'https://arcane-gorge-90547.herokuapp.com/api/event/' + id
);
}

getUserEvents() {
  this.http
  .get<{ message: string; events: any }>('https://arcane-gorge-90547.herokuapp.com/api/event/userevents')
  .pipe(
    map(eventData => {
      return eventData.events.map(event => {
        return {
          location: {lat: event.lat, lng: event.lng},
          title: event.title,
          description: event.description,
          id: event._id,
          creator: event.creator,
          dateStarted: event.dateStarted,
          dateEnded: event.dateEnded,
          guests: event.guests
        };
      });
    })
  )
  .subscribe(transformedEvents => {
    this.events = transformedEvents;
    this.newEvent.next([...this.events]);
  });
}

getEventsList(eventsPerPage: number, currentPage: number) {
  const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
  this.http
    .get<{ message: string; events: any, maxEvents: number }>('https://arcane-gorge-90547.herokuapp.com/api/event/eventslist' + queryParams)
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
            dateStarted: event.startDate,
            dateEnded: event.endDate,
            guests: event.guests
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
    .get<{ message: string; events: any }>('https://arcane-gorge-90547.herokuapp.com/api/event')
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
            dateStarted: event.startDate,
            dateEnded: event.endDate,
            guests: event.guests
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

updateEvent(id: string, title: string, description: string, location: Location, dateStarted: Date, dateEnded: Date,
guests: string[]) {

  const eventData = {
      id: id,
      title: title,
      description: description,
      location: location,
      creator: this.oldMarker.creator,
      dateStarted: dateStarted,
      dateEnded: dateEnded,
      guests: guests
    };
    this.http
    .put(
      'https://arcane-gorge-90547.herokuapp.com/api/event/' + id, eventData)
    .subscribe(response => {
      console.log(response);
    });
}

updateEventGuests(id: string, guests: string[]) {
  this.http
  .put(
   'https://arcane-gorge-90547.herokuapp.com/api/event/updateGuests/' + id, guests).subscribe(response => {
      console.log(response);
    });
}

deleteEvent(eventId: string) {
  return this.http.delete('https://arcane-gorge-90547.herokuapp.com/api/event/' + eventId);
}
}
