import { Component, ViewChild, ElementRef, NgZone,  OnInit, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '../models/location.model';
import {MouseEvent as AGMMouseEvent, MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import { EventsService } from '../services/event.service';
import { Marker } from '../models/marker.model';
import { Subscription } from 'rxjs';
import { MyAuthService } from '../../auth/auth.service';
import {MatDialog } from '@angular/material';
import { CreateEventComponent } from '../create-event/create-event.component';
import { NotificationsService } from '../services/notifications.service';
import { ErrorComponent } from '../../error/error.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  radius: number;
  location: Location = { lat: 51.678418, lng: 7.809007 };
  markers: Marker[] = [];
  isLoading = false;
  private eventsSub: Subscription;
  zoom = 16;
  userId: string;
  mode = 'create';
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  public searchControl: FormControl;
  @ViewChild('search') public searchElementRef: ElementRef;
  locationChosen = false;
  filteredMarkers = [];

  constructor(
    private eventssService: EventsService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private authService: MyAuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.eventssService.getEvents();
    this.eventsSub = this.eventssService
      .getEventUpdateListener()
      .subscribe((eventsData: Marker[]) => {
        this.isLoading = false;
        this.markers = eventsData;
      });
    this.showAllEventsInRadius(this.radius);
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    // set current position
    this.getUserLocation();

    // create search FormControl
    this.searchControl = new FormControl();
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address']
        }
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.location.lat = place.geometry.location.lat();
          this.location.lng = place.geometry.location.lng();
          this.showAllEventsInRadius(this.radius);
        });
      });
    });
  }

  getPlace($event) {
    // set latitude, longitude and zoom
    this.location.lat = $event.geometry.location.lat();
    this.location.lng = $event.geometry.location.lng();
    this.zoom = 12;
    this.showAllEventsInRadius(this.radius);
  }

  mapClicked($event: AGMMouseEvent) {
    this.location.lat = $event.coords.lat;
    this.location.lng = $event.coords.lng;
    this.locationChosen = true;
    this.showAllEventsInRadius(this.radius);
  }

  getUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.location = {lat: position.coords.latitude, lng: position.coords.longitude};
        this.zoom = 10;
        this.showAllEventsInRadius(this.radius);
      });
    }
  }

  pushNewEvent($event) {
    const newMarker: Marker = {location: { lat: $event.location.lat, lng: $event.location.lng }, title: $event.title,
      description: $event.description, id: null, creator: this.authService.getUserId(), startDate: $event.startDate,
      endDate: $event.endDate, guests: null, imagePath: $event.imagePath};
    this.markers.push(newMarker);
    this.showAllEventsInRadius(this.radius);
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  showAllEventsInRadius($event: number) {
    this.radius = $event;
    this.mapsAPILoader.load().then(() => {
      const center = new google.maps.LatLng(this.location.lat, this.location.lng);
      this.filteredMarkers = this.markers.filter(m => {
        const markerLoc = new google.maps.LatLng( m.location.lat, m.location.lng);
        const distanceInKm =
          google.maps.geometry.spherical.computeDistanceBetween(markerLoc, center) / 1000;
        if (distanceInKm < $event / 1000) {
          this.radius = $event;
          return m;
        }
      });
    });
  }

  openCreateEvent() {
    this.mode = 'create';
    const dialogRef = this.dialog.open(CreateEventComponent, {width: '400px', data: {location: this.location, mode: this.mode}
    });
    dialogRef.afterClosed().subscribe(result => {this.pushNewEvent(result); });
  }

  joinToEvent(event: Marker) {
    const guest = this.authService.getUserId();
     if (event.guests == null) {
event.guests = [];
    }
    if (event.guests.length === 0) {
    event.guests.push(guest);
    this.eventssService.updateEventGuests(event.id, guest);
    } else if (event.guests.find(u => u === guest)) {
      this.dialog.open(ErrorComponent, { width: '300px', data: {message: 'you are already registered to this event' }});
    } else {
        event.guests.push(guest);
        this.eventssService.updateEventGuests(event.id, guest);
   }
  }
}
