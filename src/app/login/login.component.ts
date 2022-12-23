import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  regForm!: FormGroup;
  results: any = false;
  authForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router) {
    if (this.authService.isLoggedIn()) {
      // redirect to profile page if already logged in
      this.router.navigateByUrl('/profile');
    }
  }

  ngOnInit() {
    this.authForm = this.fb.group({
      username: '',
      password: ''
    });

    this.regForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmitAuth() {
    this.authService.authUser(this.authForm.value.username,
      this.authForm.value.password).subscribe(data => {
        this.results = data;
        if (this.results[0].auth) {
          this.authService.loggedIn(this.results[0].token);
          location.reload()
        } else {
          alert('Wrong username or password');
        }
      });
  }

  onSubmitReg() {
    this.authService.regUser(this.regForm.value.username, this.regForm.value.email, this.regForm.value.password, 'user').subscribe();
    this.regForm.reset();
    alert('User Registered');
  }

}
