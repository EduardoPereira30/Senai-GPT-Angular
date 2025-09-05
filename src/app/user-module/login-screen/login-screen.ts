import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { concatAll, noop } from 'rxjs';

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

  async onLoginClick() {

    console.log("email", this.loginForm.value.email);
    console.log("password", this.loginForm.value.password);

    if(this.loginForm.value.email == ""){

      alert("Preencha o e-mail")
      return;
    }

    if(this.loginForm.value.password == ""){

      alert("Preencha a senha")
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST",
      headers:{
        "Content-Type" : "application/json"

      },
      body: JSON.stringify( {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password

      })
    });

    console.log("STATUS CORE", response.status);

    if( response.status >= 200 && response.status <= 299){

      alert("não a problema nenhum");

    } else if ( response.status >= 400 && response.status <= 499){

      alert("Nome de usuario ou senha icorretos")

    } else if (response.status >= 500 && response.status <= 599 ){

      alert("Erro no sistema");

    }
  }

}

