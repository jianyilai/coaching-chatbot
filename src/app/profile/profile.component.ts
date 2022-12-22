import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any = [];
  updatePasswordForm!: FormGroup;
  updateEmailForm!: FormGroup;

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private fb:
    FormBuilder) {
    this.updatePasswordForm = this.fb.group({
      password: ['', Validators.required]
    });

    this.updateEmailForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getUserByUID().subscribe((data: any) => {
      this.userData = data
    });
  }

  onUpdatePass() {
    this.userService.updatePassword(this.updatePasswordForm.value.password).subscribe(res => {
      console.log('Password Changed');
      location.reload()
    })
  }

  onUpdateEmail() {
    this.userService.updateEmail(this.updateEmailForm.value.email).subscribe(res => {
      console.log('Email Changed');
      location.reload()
    })
  }
}
