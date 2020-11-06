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
  data: any;
  playerList: [] = [];
  
  inputValue: string = "";
  successWord: string[] = []
  currentWord: string = ""
  startCurrentWord: string = ""
  endCurrentWord: string = ""
  currentWordError: string = ""
  nextWord: string[] = []
  color: boolean;
  sumWord: number;
  countInput: number
  isPlaying: boolean = false
  isReady: boolean = false

  countDown: number
  wordPerMinute: number
  time: number = 0
  arr1: any[] = []
  arr2: any[] = []

  //chat
  messageInput: string = ""
  message: string = ""
  chatbox: any


  constructor(private db: AngularFireDatabase, private socketService: SocketioService, private cookie: CookieService) {
    this.show = true
    this.countDown = 3
    this.wordPerMinute = 0
    this.name = cookie.get("name")
    socketService.setupSocketConnection()
    this.show = true
    this.socketService.socket.on("roomId", id => {
      this.roomId = id
      this.id = id
    })
    socketService.socket.on("roomUsers", users => {
      this.playerList = users.users
      console.log(this.playerList)
    })
    socketService.socket.on("roomPagaraph", pagaraph => {
      this.data = pagaraph
      console.log(this.data)
      this.loadData()
    })
  } 
  
  ngOnInit(): void {
    this.chatbox = document.getElementById('chatbox')
    this.socketService.socket.on("message", message => {
      this.outputMessage(message)
    })
    this.db.list('/data').valueChanges().subscribe(async data => {
      this.data = await data[Math.ceil(Math.random()*100%7)-1]
      this.loadData()
      this.socketService.socket.emit("new-user", {name: this.name, pagaraph: this.data})
    })
  }

  loadData() {
    this.nextWord = this.data.split(/\s/)
    this.sumWord = this.nextWord.length
    this.percent = 0
    this.styleExpression = `width:${this.percent}%`
    this.countInput = 0
    this.currentWord = this.nextWord.shift()
    this.endCurrentWord = this.currentWord
    this.startCurrentWord = ""
    this.currentWordError = ""
    this.successWord = []
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


  // Game PLay
  play() {
    this.arr1.push(setInterval(() => { 
      if(this.countDown > 0) {
        this.countDown--
      }
      else {
        this.show = !this.show
        document.getElementById("game").style.display = "block"
        document.getElementById("input").focus()
        this.isPlaying = true
        this.cpm()
        this.countDown = 60
        this.clearInterVal(this.arr1)
      }
    }, 1000))
  }
   
  onInputChange(): void {
    this.countInput = this.inputValue.length
    if (this.currentWord == this.inputValue && this.nextWord.length == 0) {
      this.successWord.push(this.currentWord);
      this.percent = ((this.successWord.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
      this.endGame()
    } else if (this.currentWord + " " == this.inputValue) {
      this.successWord.push(this.currentWord);
      this.currentWord = this.nextWord.shift();
      this.inputValue = "";
      this.percent = ((this.successWord.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
      this.countInput = 0
      this.startCurrentWord = ""
      this.currentWordError = ""
      this.endCurrentWord = this.currentWord
    } else if (this.currentWord.startsWith(this.inputValue) && this.countInput <= this.currentWord.length) {
      this.startCurrentWord = this.currentWord.slice(0, this.countInput)
      this.endCurrentWord = this.currentWord.slice(this.countInput, this.currentWord.length)
      this.color = false;
      this.currentWordError = ""
    } else {
      this.currentWordError = this.currentWord.slice(this.startCurrentWord.length, this.inputValue.length)
      this.endCurrentWord = this.currentWord.slice(this.countInput, this.currentWord.length)
      this.color = true;
    }
  }
  getInputStyle(): string {
    if (this.color) {
      return "#d08383"
    } else {
      return ""
    }
  }

  getCurrentWordStyle(): string {
    if (this.color) {
      return "#d08383"
    } else {
      return "#99cc00"
    }
  }

  reset() {
    this.ngOnInit()
    this.show = !this.show
    document.getElementById("game").style.display = "none"
    this.countDown = 3
    this.clearInterVal(this.arr1)
    this.clearInterVal(this.arr2)
  }
  
  cpm () {

    this.arr2.push(setInterval(() => {
      if(this.countDown > 0) {
        this.countDown--
      }
      else {
        this.isPlaying = false
        this.endGame()
        this.clearInterVal(this.arr2)
      }
    }, 1000))

    this.arr2.push(setInterval(() => {
      if (this.isPlaying) {
        if(this.successWord.length > 0) {
          this.time += 1000
          let character = this.successWord.length + this.startCurrentWord.length
          this.wordPerMinute = (character / (this.time / 1000)) * 60
        }
      }
      else {
        this.time = 0
        this.endGame()
        this.clearInterVal(this.arr2)
      }
    }, 1000))
  }

  endGame() {
    this.inputValue = "";
    this.countInput = 0
    this.isPlaying = false
    document.getElementById("input").setAttribute("readonly", "true")
    this.clearInterVal(this.arr1)
    this.clearInterVal(this.arr2)
  }

  clearInterVal(arr) {
    arr.map((a) => {
      clearInterval(a);
      arr = [];
    })
  }

  ready() {
    this.isReady = true
    this.socketService.socket.emit("ready", this.isReady)
    this.socketService.socket.on("start-game", () => {
      this.play()
    })
  }
}
