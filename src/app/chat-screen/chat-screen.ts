import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

interface IChat {

  chatTitle: string;
  id: number;
  userId: string;

}

interface IMenssage{

  chatId: number;
  id: number;
  text: string;
  userId: string;

}

@Component({
  selector: 'app-chat-screen',
  imports: [CommonModule],
  templateUrl: './chat-screen.html',
  styleUrl: './chat-screen.css'
})
export class ChatScreen {

  chats: IChat[];
  chatSelecionado: IChat;
  menssagens: IMenssage[];

  constructor(private htpp: HttpClient, private cd: ChangeDetectorRef) {
    //inicialização de variaveis

    this.chats = [];
    this.chatSelecionado = null!;
    this.menssagens =[];
  }

  ngOnInit() {
    //buscar dados da api

    this.getChats();

  }

  async getChats() {
    //busca os chats da api

    // let response = await this.htpp.get(" https://senai-gpt-api.azurewebsites.net/chats",{
    //   headers:{
    //     "Authorization" : "Bearer " + localStorage.getItem("meuToken")
    //   }
    // }).toPromise();

    let response = await firstValueFrom(this.htpp.get(" https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }
    ));


    console.log("Chats", response);

    if (response) {

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
    let response = await firstValueFrom(this.htpp.get(" https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }
    ));

    console.log("Menssagens", response)
    this.menssagens = response as IMenssage[];
  }
}