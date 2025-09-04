import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Quando a tela iniciar

    this.loginForm = this.fb.group({

      email: ["", [Validators.required]],
      password: ["", [Validators.required]]

    });

  }

  onLoginClick() {

    alert("Botão de login clicado")

    console.log("email", this.loginForm.value.email);
    console.log("password", this.loginForm.value.password);

  }

}
