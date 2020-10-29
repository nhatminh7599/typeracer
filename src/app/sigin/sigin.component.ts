import { Component, Injectable, OnInit,Injector } from '@angular/core';
import { ViewChild,ElementRef } from '@angular/core'
import {firebaseConfig} from '../firebaseInit'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { TyperacerComponent } from '../typeracer/typeracer.component';

@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})

export class SiginComponent implements OnInit {
  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;
  a: any
  auth:firebase.auth.UserCredential
  name: string
  constructor() { }

  ngOnInit(): void {
  }


  googleLogIn(){
    var  auth:firebase.auth.UserCredential
    firebase.initializeApp(firebaseConfig)
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().languageCode = 'pt';
    // To apply the default browser preference instead of explicitly setting it.
    // firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("Succes")
      console.log(result)
      auth = result
      
    }).catch(function(error) {
      console.log("Fail")
    });

    this.name = auth.user.displayName
  }
}

