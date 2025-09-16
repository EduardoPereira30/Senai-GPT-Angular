import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

 interface IChat {
  
  chatTitle:string;
  id: number;
  userId: string;

 }

@Component({
  selector: 'app-chat-screen',
  imports: [HttpClientModule, CommonModule],
  templateUrl:'./chat-screen.html',
  styleUrl: './chat-screen.css'
})
export class ChatScreen {

  chats : IChat[];

  constructor( private htpp:HttpClient){
    //inicialização de variaveis

    this.chats = [];
  }

  ngOnInit(){
    //buscar dados da api

    this.getChats();
    
  }

  async getChats(){
    //busca os chats da api

    let response = await this.htpp.get(" https://senai-gpt-api.azurewebsites.net/chats",{
      headers:{
        "Authorization" : "Bearer " + localStorage.getItem("meuToken")
      }
    }).toPromise();

    console.log("Chats", response);

    if(response){

    this.chats = response as [];

    } else{

      alert("error ao buscar os chats");

    }
  }
}
