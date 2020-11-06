import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { SocketioService } from "../socketio.service"
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  show: boolean;
  percent: number;
  name: string;
  styleExpression: string;
  id: string;
  roomId: string;
  inputRoomId: string;
  data: any[];
  playerList: [] = [];
  
  public paragraph : string[]
  public currentInput: string;
  public pastWords: string[] = [];
  public currentWord: string = "";
  public futureWords: string[] = [];
  public warn: boolean;
  public sumWord: number;

  //chat
  messageInput: string = ""
  message: string = ""
  chatbox: any

  constructor(private db: AngularFireDatabase, private socketService: SocketioService, private cookie: CookieService) {
    this.name = String(Math.random()*100.)
    socketService.setupSocketConnection()
    this.show = true
    this. name = cookie.get("name")
    socketService.socket.emit("new-user", this.name)
    socketService.socket.on("roomId", id => {
      this.roomId = id
      this.id = id
    })
    socketService.socket.on("roomUsers", users => {
      this.playerList = users
      console.log(this.playerList["users"])
    })
  } 
  
  ngOnInit(): void {
    this.chatbox = document.getElementById('chatbox')
    this.socketService.socket.on("message", message => {
      this.outputMessage(message)
    })
    // this.db.list('/data').valueChanges().subscribe(data => {
    //   this.data = data
    //   this.paragraph = this.data[Math.ceil(Math.random()*100%7)-1].split(/\s/)
    //   this.sumWord = this.paragraph.length
    //   this.percent = 0
    //   this.styleExpression = `width:${this.percent}%`
    //   this.pastWords = []
    //   this.currentWord = this.paragraph[0]
    //   this.futureWords = this.paragraph.splice(1)
    // })
  }
  
  joinRoom(roomId) {
    this.socketService.socket.emit("join-room", roomId)

  }

  // emit message to server
  submitChat() {
    if (this.messageInput) {
      this.socketService.socket.emit("submit", this.messageInput)
      this.messageInput = ""
    }
  }

  outputMessage(message) {
    const div = document.createElement('div')
      div.style.width = "100%"
      div.style.setProperty("word-wrap", "break-word")
      div.style.padding = "1%"
      div.style.textAlign = "justify"
      div.innerHTML = `<p style="margin: 0;">${message.userName} <span>${message.time}</span></p>
                      <p style="margin: 0;">${message.text}</p>`
      this.chatbox.appendChild(div)
      this.chatbox.scrollTop = this.chatbox.scrollHeight
  }
}
