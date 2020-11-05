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
  arr1: any[] = []
  arr2: any[] = []

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
      this.arr1.push(setInterval(() => { 
        if(this.countDown > 0) {
          this.countDown--
          console.log("ddd")
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
    this.clearInterVal(this.arr1)
    this.clearInterVal(this.arr2)
  }
  
  cpm () {

    this.arr2.push(setInterval(() => {
      console.log("cpm")
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
    this.input = "";
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
}
