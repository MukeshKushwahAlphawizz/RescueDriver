import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {Content} from "ionic-angular/index";

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
  customer:any='';
  driver:any='';
  toggled: boolean = false;
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public firedb:FirebaseProvider,
              public navParams: NavParams) {
    this.chatRef = navParams.data.chatRef;
    // console.log('check chat ref >>>>>>',this.chatRef);
    this.customer = navParams.data.customer;
    this.driver = navParams.data.driver;
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
    if (this.msg.trim() ===''){
      return;
    }
    let message = {
      message:this.msg.trim(),
      date:new Date().getTime(),
      isDriver:true,
      isRead:false
    }
    this.firedb.addMessage(message,this.chatRef).then(res=>{
      this.msg = '';
      this.scrollBottom();
      let driver = {
        date_of_join:new Date().getTime(),
        id:this.driver.id+'_D',
        image:this.driver.image,
        isDriver:true,
        name:this.driver.username !== ''?this.driver.username:this.driver.first_name+' '+this.driver.last_name
      }
      //adding a driver user into customer
      this.firedb.addUser(driver,this.customer.id);
    }).catch(err=>{})
  }
  handleSelection(event) {
    this.msg += event.char;
  }
  scrollBottom(){
    if (this.content){
      setTimeout(()=>{
        this.content.scrollToBottom();
      },200)
    }
  }
}
