import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  detailData : any = {};

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public navParams: NavParams) {
    this.detailData = navParams.data.detail;
  }

  ionViewDidLoad() {

  }
  accept(){
    this.storage.get('userData').then(userData=>{
      let user : any = JSON.parse(userData);
      let data = {
        "user_id":user.id,
        "booking_id":this.detailData.id,
        "status": "2"
      }
      this.util.presentLoader();
      this.user.acceptBooking(data).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          this.createRoom();
          this.util.presentAlert('',resp.message);
          this.navCtrl.setRoot('TabsPage');
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.log(error);
        this.util.dismissLoader();
      })
    })
  }

  createRoom() {

  }
}
