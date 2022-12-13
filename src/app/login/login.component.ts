import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    private router: Router) { }

  ngOnInit() {
    this.authForm = this.fb.group({
      username: '',
      password: ''
    });

    this.regForm = this.fb.group({
      username: '',
      email: '',
      password: ''
    });
  }

  onSubmitAuth() {
    this.authService.authUser(this.authForm.value.username,
      this.authForm.value.password).subscribe(data => {
        this.results = data;
        if (this.results[0].auth) {
          this.authService.loggedIn(this.results[0].token);
          this.router.navigateByUrl('/profile');
        } else {
          console.log("Wrong username or password")
        }
      });
  }

  onSubmitReg() {
    this.authService.regUser(this.regForm.value.username, this.regForm.value.email, this.regForm.value.password, 'user').subscribe();
    this.router.navigateByUrl('/login');
    console.log('user registered')
  }

}
