import { Component, OnInit } from '@angular/core';
import { ViewChild,ElementRef } from '@angular/core'
import * as firebase from 'firebase/app'
import 'firebase/auth'

@Component({
  selector: 'app-sigin',
  templateUrl: './sigin.component.html',
  styleUrls: ['./sigin.component.css']
})
export class SiginComponent implements OnInit {
  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;
  a: any
  auth2: any
  username: any
  firebaseConfig = {
    apiKey: "AIzaSyBgvvb0FZif_4CBY6qE_B2mykuixt6q0cE",
    authDomain: "myprojecttyperace.firebaseapp.com",
    databaseURL: "https://myprojecttyperace.firebaseio.com",
    projectId: "myprojecttyperace",
    storageBucket: "myprojecttyperace.appspot.com",
    messagingSenderId: "155054231664",
    appId: "1:155054231664:web:1f2bd565c89093b81364b5",
    measurementId: "G-HPEYPWL0LZ"
  };
  constructor() { }

  ngOnInit(): void {
  }
  googleLogIn(){
    firebase.initializeApp(this.firebaseConfig)
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().languageCode = 'pt';
    // To apply the default browser preference instead of explicitly setting it.
    // firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("Succes")
      console.log(result)
      this.a = result.credential
      console.log(this.a.accessToken)
    }).catch(function(error) {
      console.log("Fail")
    });
    
  }
}
