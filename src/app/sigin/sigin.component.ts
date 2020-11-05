import { Component, Injectable, OnInit} from '@angular/core';
import { ViewChild,ElementRef } from '@angular/core'
import {firebaseConfig} from '../firebaseInit'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { TyperacerComponent } from '../typeracer/typeracer.component'


@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class SiginComponent implements OnInit {
  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;
  a: any
  auth:firebase.auth.UserCredential
  name: string = ""
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
      this.name = result.additionalUserInfo.profile["name"]
      document.cookie = "name="+ this.name
      console.log(this.name)
    })
    .catch(function(error) {
      console.log("Fail")
    });
    document.cookie = "name="+this.name;
  }

  facebookLogIn(){22
    firebase.initializeApp(firebaseConfig)
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    firebase.auth().languageCode = 'fr_FR';
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();
   firebase.auth().languageCode = 'pt';
    // To apply the default browser preference instead of explicitly setting it.
    // firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    document.cookie = "name="+this.name;
  }
  getName(){
    return this.name
  }
}

