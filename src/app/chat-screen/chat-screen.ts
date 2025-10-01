import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface IChat {

  chatTitle: string;
  id: number;
  userId: string;

}

interface IMenssage {

  chatId: number;
  id: number;
  text: string;
  userId: string;

}

@Component({
  selector: 'app-chat-screen',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-screen.html',
  styleUrl: './chat-screen.css'
})

export class ChatScreen {

  chats: IChat[];
  chatSelecionado: IChat;
  menssagens: IMenssage[];
  mensagemUsuario = new FormControl("");
  darkMode: boolean = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {
    //inicialização de variaveis

    this.chats = [];
    this.chatSelecionado = null!;
    this.menssagens = [];
  }

  ngOnInit() {
    //buscar dados da api

    this.getChats();

    let darkModeLocalStorage = localStorage.getItem("darkMode");

    if (darkModeLocalStorage == "true") {

      this.darkMode = true;
      document.body.classList.toggle("darkmode", this.darkMode)
    }

  }

  async getChats() {
    //busca os chats da api

    // let response = await this.htpp.get(" https://senai-gpt-api.azurewebsites.net/chats",{
    //   headers:{
    //     "Authorization" : "Bearer " + localStorage.getItem("meuToken")
    //   }
    // }).toPromise();

    let response = await firstValueFrom(this.http.get(" https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }
    )) as IChat[];



    if (response) {

      console.log("Chats", response);


      let userId = localStorage.getItem("meuId");

      response = response.filter(chat => chat.userId == userId);

      this.chats = response as [];

    } else {

      alert("error ao buscar os chats");

    }

    this.cd.detectChanges();

  }

  async onChatClick(chatClicado: IChat) {

    console.log("Chat Clicado", chatClicado);
    this.chatSelecionado = chatClicado;

    //logica para buscar as mensagens.
    let response = await firstValueFrom(this.http.get(" https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }
    ));

    console.log("Menssagens", response)
    this.menssagens = response as IMenssage[];
    this.cd.detectChanges();
  }

  async enviarMenssagen() {

    let novaMessagenUsuario = {

      chatId: this.chatSelecionado.id,
      userId: localStorage.getItem("meuId"),
      text: this.mensagemUsuario.value

    };

    let novaMessagenUsuarioresponse = await firstValueFrom(this.http.post(" https://senai-gpt-api.azurewebsites.net/messages", novaMessagenUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }
    ));

    await this.onChatClick(this.chatSelecionado)

    // 2- enveiar mensagen do usuario para IA responder

    let respostaIARespose = await firstValueFrom(this.http.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      "contents": [
        {
          "parts": [
            {
              "text": this.mensagemUsuario.value + ".Me de uma resposta objetiva"
            }
          ]
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": "AIzaSyDV2HECQZLpWJrqCKEbuq7TT5QPKKdLOdo"

      }
    })) as any;

    let novaRespostaIA = {
      chatId: this.chatSelecionado.id,
      userId: "chatbot",
      text: respostaIARespose.candidates[0].content.parts[0].text
    }

    let novaRespostaIAResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages&quot", novaRespostaIA, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    await this.onChatClick(this.chatSelecionado);


  }

  async novoChat() {

    const nomeChat = prompt("Digite o nome do novo chat")

    if (!nomeChat) {
      alert("Nome invalido");
      return;
    }

    const novoChatObj = {
      chatTitle: nomeChat,
      userId: localStorage.getItem("meuId")


    }

    let novoChatResponse = await firstValueFrom(this.http.post(" https://senai-gpt-api.azurewebsites.net/chats", novoChatObj, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    })) as IChat;
    await this.getChats();

    await this.onChatClick(novoChatResponse)
  }

  deslogar() {

    localStorage.removeItem("meuToken");
    localStorage.removeItem("userId");

    window.location.href = "login";
  }

  LigarDesligarDarkMode() {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle("dark Mode", this.darkMode);

    localStorage.setItem("darkMode", this.darkMode.toString());
  }
}