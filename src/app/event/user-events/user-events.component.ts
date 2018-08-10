import {Component, OnInit, OnDestroy} from '@angular/core';
import { Marker } from '../models/marker.model';
import { Subscription } from 'rxjs';
import { EventsService } from '../services/event.service';
import { MyAuthService } from '../../auth/auth.service';
import { PageEvent, MatDialog } from '@angular/material';
import { CreateEventComponent } from '../create-event/create-event.component';

@Component ({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.css']
  })

  export class UserEventsComponent implements OnInit, OnDestroy {
    events: Marker[] = [];
    isLoading = false;
    totalEvents = 3;
    eventsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    mode: string;
    location: Location;
  userId: string;
  private eventsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public eventsService: EventsService, private authService: MyAuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.eventsService.getEventsList(this.eventsPerPage, this.currentPage);
    this.eventsSub = this.eventsService
      .getEventListUpdateListener().subscribe((eventsData: {events: Marker[], eventsCount: number}) => {
        this.isLoading = false;
        this.events = eventsData.events;
        this.totalEvents = eventsData.eventsCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
this.currentPage = pageData.pageIndex + 1;
this.eventsPerPage = pageData.pageSize;
this.eventsService.getEventsList(this.eventsPerPage, this.currentPage);
  }
   onDelete(eventId: string) {
     this.isLoading = true;
     this.eventsService.deleteEvent(eventId).subscribe(() => {
     this.eventsService.getEventsList(this.eventsPerPage, this.currentPage);
    });
   }


  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  }
