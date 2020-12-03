import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {App} from "ionic-angular/index";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-my-history',
  templateUrl: 'my-history.html',
})
export class MyHistoryPage {
  historyList: any = [];
  isListEmpty:boolean=false;
  userData:any={};
  constructor(public navCtrl: NavController,
              public util : UtilProvider,
              public user : User,
              public storage : Storage,
              public app : App,
              public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.getHistoryList();
  }
  getHistoryList() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.util.presentLoader();
      let data = {
        "user_id":this.userData.id,
        "status":"1"
      }
      this.user.getHistory(data).subscribe(res=>{
        let resp : any =res;
        if (resp.status){
          this.historyList = resp.data;
        }
        this.historyList && this.historyList.length>0?this.isListEmpty=false:this.isListEmpty=true;
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.error(error);
        this.util.dismissLoader();
        this.historyList && this.historyList.length>0?this.isListEmpty=false:this.isListEmpty=true;
      })
    })
  }

  chat() {
    this.app.getRootNav().push('ChatPage');
  }

  notificaion(){
    this.app.getRootNav().push('NotificationsPage');
  }

  startTracking(item: any) {
    this.util.presentConfirm('Trip Start','Are you sure want to start the trip?').then(()=>{
      this.util.presentLoader();
      let data = {
        "driver_id":this.userData.id,
        "booking_id":item.id,
        "latitude":"",
        "longitude":"",
        "trip_status":"1"
      }
      this.user.tripStartEnd(data).subscribe(res=>{
        let resp : any =res;
        if (resp.status){
          this.storage.set('startedTripData',resp.data).then(()=>{
            this.app.getRootNav().setRoot('TrackLocationPage');
          })
        }else {
          this.util.presentToast(resp.message);
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }).catch(()=>{})
  }
}
