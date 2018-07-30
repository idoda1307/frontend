import { Component, OnInit } from '@angular/core';
import { MyAuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = 'BHaPNr3ahIjNO7tV53ZA1pA1lF2yPDucuuM4XAuIIfTsl3-esKZr6Sv73d3Oo_huYNpG5vGz1JMbUlLMEIT82oc';
  readonly VAPID_PRIVATE_KEY = 'qIoM1pO1B09uyKE1KJfv2hQq7FBCEVu4T7O9J35N4SU';

constructor(private authService: MyAuthService) {}
ngOnInit() {
this.authService.autoAuthUser();
}
}
