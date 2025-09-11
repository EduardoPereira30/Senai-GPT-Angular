import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen',
  imports: [],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css'

})

export class NewUserScreen {

  newForm: FormGroup;

  emailErrorMessage: string;
  passwordErrorMessage: string;
  successStatusMessage: string;
  errorStatusMessage: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    // Quando a tela iniciar

    this.newForm = this.fb.group({

      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      name:["",[Validators.required]]

    });

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.successStatusMessage = "";
    this.errorStatusMessage = "";

  }

  async onNewClick() {


    if (this.newForm.value.email == "") {

      this.emailErrorMessage = "O campo de email é obrigatorio";
      return;
    }

    if (this.newForm.value.password == "") {

      this.passwordErrorMessage = "O campo de senha é obrigatorio";
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"

      },
      body: JSON.stringify({
        email: this.newForm.value.email,
        password: this.newForm.value.password

      })
    });

    console.log("STATUS CORE", response.status);
  }


}
