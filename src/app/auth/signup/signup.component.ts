import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MyAuthService} from '../auth.service';
import { Subscription } from 'rxjs';

@Component ({
selector: 'app-signup',
templateUrl: './signup.component.html',
styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

constructor(public authService: MyAuthService) {}

ngOnInit() {
 this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
   authStatus => {
this.isLoading = false;
   }
 );
}

ngOnDestroy() {
  this.authStatusSub.unsubscribe();
}
  onSignup(form: NgForm) {
    if (form.invalid) {
return;
    }
    this.isLoading = true;
this.authService.createUser( form.value.email, form.value.password, form.value.userName);
  }
}
