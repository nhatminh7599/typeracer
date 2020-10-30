import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-typeracer',
  templateUrl: './typeracer.component.html',
  styleUrls: ['./typeracer.component.css']
})
export class TyperacerComponent implements OnInit {
  show: boolean
  percent: number
  name: string
  styleExpression: string
  data: any[]
  
  input: string;
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

  countDown: number
  wordPerMinute: number
  time: number = 0

  constructor(private db: AngularFireDatabase) {
    this.show = true
    this.countDown = 3
    this.wordPerMinute = 0
  } 
  
  ngOnInit(): void {
    this.db.list('/data').valueChanges().subscribe(data => {
      this.data = data
      this.nextWord = this.data[Math.ceil(Math.random()*100%7)-1].split(/\s/)
      console.log(this.nextWord)
      this.sumWord = this.nextWord.length
      this.percent = 0
      this.styleExpression = `width:${this.percent}%`
      this.countInput = 0
      this.currentWord = this.nextWord.shift()
      this.endCurrentWord = this.currentWord
      this.input = "";
      this.startCurrentWord = ""
      this.currentWordError = ""
      this.successWord = []
    })
  }
  
  play() {
    if (this.name && this.name.trim() != "") {
      var count = setInterval(() => { 
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
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(count)
      }, 4000);
    }
  }
   
  onInputChange(): void {
    this.countInput = this.input.length
    if (this.currentWord == this.input && this.nextWord.length == 0) {
      this.successWord.push(this.currentWord);
      this.percent = ((this.successWord.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
      this.endGame()
    } else if (this.currentWord + " " == this.input) {
      this.successWord.push(this.currentWord);
      this.currentWord = this.nextWord.shift();
      this.input = "";
      this.percent = ((this.successWord.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
      this.countInput = 0
      this.startCurrentWord = ""
      this.currentWordError = ""
      this.endCurrentWord = this.currentWord
    } else if (this.currentWord.startsWith(this.input) && this.countInput <= this.currentWord.length) {
      this.startCurrentWord = this.currentWord.slice(0, this.countInput)
      this.endCurrentWord = this.currentWord.slice(this.countInput, this.currentWord.length)
      this.color = false;
      this.currentWordError = ""
    } else {
      this.currentWordError = this.currentWord.slice(this.startCurrentWord.length, this.input.length)
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
  }
  
  cpm () {

    var speed = () => {
      if (this.isPlaying) {
        if(this.successWord.length > 0) {
          this.wordPerMinute = (this.successWord.length / (this.time / 1000)) * 60
          this.time += 1000
        }
        else {
          this.wordPerMinute
          this.time += 1000
        }
      }
      else {
        this.time = 0
        this.endGame()
        clearInterval(getSpeed)
      }
    }

    var timeCountDown = () => {
      if(this.countDown > 0) {
        this.countDown--
      }
      else {
        this.isPlaying = false
        this.endGame()
        clearInterval(getTime)
      }
    }

    var getTime = setInterval(timeCountDown, 1000)
    var getSpeed = setInterval(speed, 1000)
  }

  endGame() {
    this.input = "";
    this.countInput = 0
    this.isPlaying = false
    document.getElementById("input").setAttribute("readonly", "true")
  }
}
