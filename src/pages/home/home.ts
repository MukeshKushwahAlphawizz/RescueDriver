import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {Geolocation} from "@ionic-native/geolocation";
import {Events} from "ionic-angular/index";
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  bookingList: any = [];
  userData : any = {}
  isListEmpty: boolean = false;
  interval: any = '';

  watch:any = '';
  subscription:any = '';

  constructor(public navCtrl: NavController,
              public user:User,
              public geolocation:Geolocation,
              public storage:Storage,
              public events:Events,
              public util:UtilProvider,
              public navParams: NavParams) {
    events.subscribe('bookingRequest',()=>{
      this.getAllRequest(false);
    })
  }

  ionViewDidLoad() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.getAllRequest(false);
      if (this.interval){
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        this.updateCurrentLocation();
      }, 8000);
      // this.getCurrentLocation();
    })
  }
  /*getCurrentLocation() {
    console.log('getCurrentLocation called');
    this.watch = this.geolocation.watchPosition({enableHighAccuracy: true});
    this.subscription = this.watch.subscribe((data) => {
      console.log('watch geolocation data >>>',data);
    });
  }*/
  ngOnDestroy(){
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  chat_list(){
    this.navCtrl.push("ChatListPage");
  }
  view(item){
    this.navCtrl.push("DetailsPage",{detail:item});
  }
  openNotif(){
    this.navCtrl.push("NotificationsPage");
  }

  getAllRequest(isRefresh) {
    this.util.presentLoader();
    let data = {
      "user_id":this.userData.id
    }
    this.user.getAllBookings(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.bookingList = resp.data;
      }else {
        if (isRefresh){
          this.bookingList = [];
        }
      }
      this.bookingList.length && this.bookingList.length > 0?this.isListEmpty = false:this.isListEmpty = true;
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
    },error => {
      console.error(error);
      this.bookingList.length && this.bookingList.length > 0?this.isListEmpty = false:this.isListEmpty = true;
      this.util.dismissLoader();
    })
  }

  updateCurrentLocation() {
    // console.log('updateCurrentLocation called !!!!');
    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
      console.log('lat',resp.coords.latitude,'lng',resp.coords.longitude);
      let rawData = {
        "user_id":this.userData.id,
        "latitude":resp.coords.latitude,
        "longitude":resp.coords.longitude,
        "user_type":"2"
      }
      this.user.updateLatLng(rawData).subscribe(res => {
      }, error => {
        console.log(error);
      })
    });
  }

  reject(item: any) {
    let data = {
      "user_id":this.userData.id,
      "booking_id":item.id,
      "status": "3"
    }
    this.util.presentLoader();
    this.user.acceptBooking(data).subscribe(res=>{
      let resp : any = res;
      if (resp.status){
        this.util.presentToast(resp.message);
        setTimeout(()=>{
          this.getAllRequest(true);
        },1000);
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
    },error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }
}

