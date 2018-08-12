import { Component, OnInit, OnDestroy, Input,  Inject} from '@angular/core';
import { Location } from '../models/location.model';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { EventsService } from '../services/event.service';
import { Marker } from '../models/marker.model';
import { Subscription } from 'rxjs';
import { MyAuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorComponent } from '../../error/error.component';
import { NotificationsService } from '../services/notifications.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit, OnDestroy {
  @Input() location: Location;
  marker: Marker;
  isLoading = false;
  form: FormGroup;
  mode: string;
  imagePreview: string;
  private eventId: string;
  private authStatusSub: Subscription;
  private eventsSub: Subscription;
  btnName: string;
  constructor(
    public eventssService: EventsService,
    private authService: MyAuthService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private notificationService: NotificationsService,
    public dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { location: Location; eventId: string; mode: string, event: Marker }
  ) {}

  ngOnInit() {
    if (this.data.mode === 'create') {
      this.btnName = 'Add Event';
    } else {
      this.btnName = 'Update Event';
      this.eventssService.getEvent(this.data.eventId).subscribe(eventData => {
        this.isLoading = false;
        this.marker = {
          id: eventData._id,
          title: eventData.title,
          description: eventData.description,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          location: {lat: eventData.lat, lng: eventData.lng},
          creator: eventData.creator,
          guests: eventData.guests,
          imagePath: eventData.imagePath
        };
        this.form.setValue({
        title: this.marker.title,
        description: this.marker.description,
        startDate: this.marker.startDate,
        endDate: this.marker.endDate,
        image: this.marker.imagePath
            });
        });
    }
    this.notificationService.subscribeToNotifications();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = this.fb.group({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null, { validators: [Validators.required] }),
      endDate: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
  }

  onAddEvent() {
    if (this.form.value.startDate >= this.form.value.endDate) {
      this.dialog.open(ErrorComponent, { width: '250px', data: {message: 'your start date must be before your end date' }});
      return;
    } else if (this.form.invalid) {
        return;
      } else if (this.data.mode === 'create') {
        this.marker = {id: null, title: this.form.value.title, description: this.form.value.description, location: this.data.location,
          creator: this.authService.getUserId(), startDate: this.form.value.startDate, endDate: this.form.value.endDate, guests: null,
        imagePath: this.form.value.image};
       this.eventssService.addEvent(this.marker, this.form.value.image);
      this.notificationService.sendNotifications(this.marker);
     // this.isLoading = true;
      this.dialogRef.close(this.marker);
    } else if (this.data.mode === 'edit') {
      this.marker = {
        id: this.data.eventId,
        title: this.form.value.title,
        description: this.form.value.description,
        location: this.data.event.location,
        creator: this.authService.getUserId(),
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        guests: this.data.event.guests,
        imagePath: this.form.value.image
      };
      this.eventssService.updateEvent(this.marker, this.form.value.image , this.data.eventId);
      this.isLoading = true;
      this.dialogRef.close(this.marker);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
