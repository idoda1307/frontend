import {Location} from './location.model';

export interface Marker {
  id: string;
  location: Location;
   title: string;
   description: string;
   creator: string;
   startDate: Date;
   endDate: Date;
   guests?: string[];
   imagePath: string;
}
