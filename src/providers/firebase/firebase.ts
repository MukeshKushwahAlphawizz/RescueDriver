import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class FirebaseProvider {
  chats: Observable<any[]>;
  users: Observable<any[]>;
  private displayDetail: any = [];
  chatRef :any;
  userRef :any;
  item: Observable<any>;

  constructor(public http: HttpClient,public db : AngularFireDatabase) {
    this.chatRef = this.db.database.ref('/all-chats');
    // this.userRef = this.db.database.ref('/all-users');
  }

  addUser(user,ref) {
    this.userRef = this.db.database.ref('/all-users/'+ref);
    this.userRef.push(user).then(() =>{})
  }
  getAllUsers(userId){
    this.users = this.db.list('/all-users/'+userId).valueChanges();
    return this.users;
  }

  addMessage(message,ref) {
    return new Promise((resolve, reject) => {
      this.chatRef = this.db.database.ref('/all-chats/'+ref);
      this.chatRef.push(message).then(() =>{
        resolve(true);
      }).catch(()=>{
        reject(false);
      });
    });
  }
  getAllUserChats(customerDriverId){
    this.chats = this.db.list('/all-chats/'+customerDriverId).valueChanges();
    return this.chats;
  }









  getAll(){
    /*const itemRef = this.db.object('reacueanycar'); //udate object
    itemRef.update({ age: 12 });*/

    /*const itemRef = this.db.object('reacueanycar/age');
    itemRef.remove();*/

    /*this.chats = this.db.list('/').valueChanges();
    this.chats.subscribe(data=>{
      console.log('list data is >>>',data);
    });
    let itemRef = this.db.object('chats');
    itemRef.snapshotChanges().subscribe(action => {
      console.log('value >>',action.payload.val())
    });*/
    // console.log('getAll item >>>',this.items);
  }

  getDetails(){
    this.db.list('/chats').snapshotChanges().subscribe((res) => {
      let tempArray:any = [];
      res.forEach((ele) => {
        tempArray.push(ele.payload.val())
      });
      this.displayDetail = tempArray;
    })
  }

  addData(addName) {
    this.chatRef.push({ name: addName }).then(() =>{ addName =""; })
  }

  updateData(add, updatedName){
    this.db.list('/chats').snapshotChanges().subscribe((res) => {
      res.forEach((ele:any) => {
        console.log('elements >>',ele.payload.val());
        if(ele.payload.val().name == add) {
          this.db.list('/chats').update(ele.key,{ name: updatedName }).then(() => {
            /*this.Updatedname = "";
            this.name = "";*/
            add = "";
            updatedName = "";
          })
        }
      });
    });
  }

  deleteData(removeName){
    this.db.list('/chats').snapshotChanges().subscribe((res) => {
      res.forEach((ele:any) => {
        if(ele.payload.val().name == removeName) {
          this.db.list('/chats').remove(ele.key).then(() => {
            /*this.Updatedname = "";
            this.name = "";*/
            removeName = "";
          })
        }
      });
    });
  }

  /*addMessage(object){
    const itemRef = this.db.object('all-chats'); //add object
    itemRef.set({ name: 'new name!',message:'hello',date:new Date().getTime()});
  }*/

  /*addRoom(roomName){
    let object = this.db.object(roomName);
    object.set({'key':'value'});
  }*/
  /*addMyUser(roomName,user){
    let object = this.db.object(roomName);
    object.set(user);
  }*/
}

