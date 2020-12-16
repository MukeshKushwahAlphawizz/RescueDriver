import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  allUsers:any=[];
  userData:any={};
  isListEmpty:boolean=false;
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public firedb:FirebaseProvider,
              public navParams: NavParams) {
    let user = {
      date_of_join:new Date().getTime(),
      id:'100'+Math.random(),
      image:'',
      isDriver:true,
      isAvailable:true,
      name:'driver_'
    }
    /*this.firedb.addUser(user,'1002');
    this.firedb.addUser(user,'1002');
    this.firedb.addUser(user,'1002');*/
  }

  ionViewDidLoad() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.util.presentLoader();
      this.firedb.getAllUsers(this.userData.id).subscribe(data=>{
        if (data && data.length){
          this.allUsers = data;
        }
        this.allUsers.length && this.allUsers.length>0?this.isListEmpty=false:this.isListEmpty=true;
        //console.log('all users >>>',this.allUsers);
        setTimeout(()=>{
          this.util.dismissLoader();
        },500);
      });
    })
  }
  chat(){
    this.navCtrl.push("ChatPage");
  }
  notificaion(){
    this.navCtrl.push("NotificationsPage");
  }
  openChat(customer){
    let chatRef = customer.id+'-'+this.userData.id;
    this.navCtrl.push("ChatPage",{chatRef:chatRef});
  }
}
