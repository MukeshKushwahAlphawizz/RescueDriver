import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {Content} from "ionic-angular/index";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;

  chatRef:any={}
  chats: any[] = [];
  isListEmpty: boolean = false;
  msg: any = '';
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public firedb:FirebaseProvider,
              public navParams: NavParams) {
    this.chatRef = navParams.data.chatRef;
  }

  ionViewDidLoad() {
    this.getAllChats();
  }
  notificaion(){
    this.navCtrl.push("NotificationsPage");
  }

  getAllChats() {
    this.util.presentLoader();
    this.firedb.getAllUserChats(this.chatRef).subscribe(data=>{
      if (data && data.length){
        this.chats = data;
      }
      this.chats.length && this.chats.length>0?this.isListEmpty=false:this.isListEmpty=true;
      // console.log('all chats are >>>',this.chats);
      setTimeout(()=>{
        this.scrollBottom();
        this.util.dismissLoader();
      },500);
    });
  }

  sendMessage() {
    let message = {
      message:this.msg,
      date:new Date().getTime(),
      isDriver:true,
      isRead:false
    }
    this.firedb.addMessage(message,this.chatRef).then(res=>{
      this.msg = '';
      this.scrollBottom();
    }).catch(err=>{})
  }

  scrollBottom(){
    if (this.content){
      this.content.scrollToBottom();
    }
  }
}
