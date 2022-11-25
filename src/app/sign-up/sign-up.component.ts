import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  myForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router) { }


  ngOnInit() {
    this.myForm = this.fb.group({
      username: '',
      email: '',
      password: '',
      role: ''
    });
  }
  onSubmit() {
    this.authService.regUser(this.myForm.value.username, this.myForm.value.email, this.myForm.value.password, 'user').subscribe();
    this.router.navigateByUrl('/login');
    console.log('user registered')
  }

}
