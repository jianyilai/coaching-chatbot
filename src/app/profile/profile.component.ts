import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth.service';
import { UserService } from 'app/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any = [];
  updatePasswordForm!: FormGroup;
  updateEmailForm!: FormGroup;

  constructor(private userService: UserService, private authService: AuthService, private fb:
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
      alert('Password Changed');
      location.reload()
    })
  }

  onUpdateEmail() {
    this.userService.updateEmail(this.updateEmailForm.value.email).subscribe(res => {
      alert('Email Changed');
      location.reload()
    })
  }

  onDelete() {
    const result = window.confirm('Are you sure you want to delete this account?');
    if (result) {
      this.userService.deleteAccount().subscribe(() => {
        this.authService.logout();
        location.reload();
      });
    }
  }
}
