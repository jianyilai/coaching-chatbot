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

  public userData: any = [];
  updatePasswordForm!: FormGroup;

  constructor(private authService: AuthService, private userService: UserService, private router: Router, private formBuilder:
    FormBuilder) {
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getUserByUID().subscribe((data: any) => {
      this.userData = data
      console.log(this.userData)
    });
  }

  onUpdatePass() {
    this.userService.updatePassword(this.updatePasswordForm.value).subscribe(res => {
      console.log('Password Changed');
      location.reload();
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  };

}
