import {Location} from './location.model';

export interface Marker {
  id: string;
  location: Location;
   title: string;
   description: string;
   creator: string;
   dateStarted: Date;
   dateEnded: Date;
   guests: string[];
}
