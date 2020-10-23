import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { SocketioService } from "../socketio.service"


@Component({
  selector: 'app-typeracer',
  templateUrl: './typeracer.component.html',
  styleUrls: ['./typeracer.component.css']
})
export class TyperacerComponent implements OnInit {
  show :boolean
  paragraph : string
  percent : number
  roomId :number
  p : string[]
  name : string
  contain :string
  i : number
  styleExpression: string

  data: any[]

  constructor(private db: AngularFireDatabase, private socketService: SocketioService) {
    db.list('/data').valueChanges().subscribe(data => {
      this.show = true
      this.roomId = Math.ceil(Math.random()*100%7);
      this.data = data
      this.paragraph = this.data[this.roomId-1]
      this.p = this.paragraph.split(/\s/)
      console.log(this.p)
      this.i = 0
      this.percent = 0
      this.styleExpression = `width:${this.percent}%`
      this.socketService.setupSocketConnection()
      
    })
    

    
  } 
  
  ngOnInit(): void {
    
  }

  onEnter(value: string) { 
    this.name = value; this.show = !this.show 
    this.socketService.socket.emit("new-user", value)
  }

  onSpace(a) { 
    if(this.i < this.p.length){
      if(a.value.trim() === this.p[this.i]){
        a.value = null
        this.p.shift;
        console.log(this.p)
        this.i++
        this.percent += (100 / this.p.length)
        this.styleExpression = `width:${this.percent}%`
      }
      else
        console.log("N")
    }
  }
    
}
