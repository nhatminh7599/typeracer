import { Component, Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-typeracer',
  templateUrl: './typeracer.component.html',
  styleUrls: ['./typeracer.component.css']
})

@Injectable()
export class TyperacerComponent implements OnInit {
  show: boolean
  percent: number
  name: string
  styleExpression: string
  data: any[]
  
  public paragraph : string[]
  public currentInput: string;
  public pastWords: string[] = [];
  public currentWord: string = "";
  public futureWords: string[] = [];
  public warn: boolean;
  public sumWord: number;

  constructor(private db: AngularFireDatabase) {
    this.show = true
  } 
  


  ngOnInit(): void {
    this.db.list('/data').valueChanges().subscribe(data => {
      this.data = data
      this.paragraph = this.data[Math.ceil(Math.random()*100%7)-1].split(/\s/)
      this.sumWord = this.paragraph.length
      this.percent = 0
      this.styleExpression = `width:${this.percent}%`

      this.pastWords = []
      this.currentWord = this.paragraph[0]
      this.futureWords = this.paragraph.splice(1)
    })
  }
  
  play() {
    if (this.name && this.name.trim() != "") {
      this.show = !this.show
      document.getElementById("game").style.display = "block"
    }
  }
   
  onInputChange(): void {
    if (this.currentWord == this.currentInput && this.futureWords.length == 0) {
      this.pastWords.push(this.currentWord);
      this.currentInput = "";
      this.currentWord = ""
      this.percent = ((this.pastWords.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
      document.getElementById("input").setAttribute("readonly", "true")
    } else if (this.currentWord + " " == this.currentInput) {
      this.pastWords.push(this.currentWord);
      this.currentWord = this.futureWords[0];
      this.futureWords = this.futureWords.splice(1);
      this.currentInput = "";
      this.percent = ((this.pastWords.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
    } else if (this.currentWord.startsWith(this.currentInput)) {
      this.warn = false;
    } else {
      this.warn = true;
    }
  }

  getInputStyle(): string {
    if (this.warn) {
      return "#d08383"
    } else {
      return ""
    }
  }

  getCurrentWordStyle(): string {
    if (this.warn) {
      return "#d08383"
    } else {
      return "#99cc00"
    }
  }

  reset() {
    this.ngOnInit()
    this.show = !this.show
    document.getElementById("game").style.display = "none"
  }
}
