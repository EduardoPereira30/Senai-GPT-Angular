import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen',
  imports: [],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css'

})

export class NewUserScreen {

  NewUserForm: FormGroup;

  emailErrorMessage: string;
  passwordErrorMessage: string;
  succesStatusMessage: string;
  errorStatusMessage: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    // Quando a tela iniciar

    this.NewUserForm = this.fb.group({

      email: ["", [Validators.required,Validators.email]],
      password: ["", [Validators.required,Validators.minLength(6),Validators.pattern]],
      name:["",[Validators.required]],
      succesStatusMessage: ["", Validators.required]

    });

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.succesStatusMessage = "";
    this.errorStatusMessage = "";

  }

  async onNewClick() {

    if(this.NewUserForm.value.email.includes("@") == false){

      alert("email invalido");
      return;

    }

    if(this.NewUserForm.invalid){

      alert("preencha todos os campos corretamente");
      return;

    }

    // const(name,email,password,confirmPassword) =this.NewUserForm.value;

    if (this.NewUserForm.value.confirmPassword == "") {

      alert ("O campo de senha é obrigatorio");
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"

      },
      body: JSON.stringify({
        email: this.NewUserForm.value.email,
        password: this.NewUserForm.value.password

      })
    });

    console.log("STATUS CORE", response.status);
  }


}
