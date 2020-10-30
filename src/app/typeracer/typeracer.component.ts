import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { SiginComponent } from '../sigin/sigin.component'

@Component({
  selector: 'app-typeracer',
  templateUrl: './typeracer.component.html',
  styleUrls: ['./typeracer.component.css'],
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

  constructor(private db: AngularFireDatabase, private sigin: SiginComponent,   private route: ActivatedRoute,) {
    this.show = true
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
      this.show = !this.show
      document.getElementById("game").style.display = "block"
    }
  }
   
  onInputChange(): void {
    this.countInput = this.input.length
    if (this.currentWord == this.input && this.nextWord.length == 0) {
      this.successWord.push(this.currentWord);
      this.input = "";
      this.currentWord = ""
      this.countInput = 0
      this.startCurrentWord = ""
      this.endCurrentWord = ""
      this.currentWordError = ""
      this.percent = ((this.successWord.length) / this.sumWord) * 100
      this.styleExpression = `width:${this.percent}%`
      document.getElementById("input").setAttribute("readonly", "true")
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
    document.getElementById("input").setAttribute("readonly", "false")
  }

  wpm() {
    if (this.isPlaying)
    {
      
    }
  }
}
