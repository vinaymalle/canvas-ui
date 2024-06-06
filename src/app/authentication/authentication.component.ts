import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DrawService } from '../services/draw.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  loginPage: boolean = false;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private authService: AuthService, private router: Router, private drawservice: DrawService) {

  }

  submitLoginForm() {
    this.authService.login(this.loginForm.value).subscribe((data: any) => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        this.drawservice.createConnection();
        this.router.navigateByUrl('dashboard');
      } else {
        alert('Please check credentials...');
      }
    })
  }

  submitRegisterForm() {
    this.authService.register(this.registerForm.value).subscribe((data: any) => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        this.drawservice.createConnection();
        this.router.navigateByUrl('dashboard');
      } else {
        alert('User name already taken...');
      }
    })
  }
}
