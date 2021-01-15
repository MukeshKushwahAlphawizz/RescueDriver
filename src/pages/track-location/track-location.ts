import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Geolocation} from "@ionic-native/geolocation";
import {FirebaseProvider} from "../../providers/firebase/firebase";

declare var google;
@IonicPage()
@Component({
  selector: 'page-track-location',
  templateUrl: 'track-location.html',
})
export class TrackLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  lat1:any='';
  long1:any='';
  lat2:any='';
  long2:any='';
  tripData:any={};
  userData:any={};
  map: any='';

  interval:any;
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public firedb:FirebaseProvider,
              public storage:Storage,
              public geolocation:Geolocation,
              public navParams: NavParams) {
    this.storage.get('startedTripData').then(startedTripData=>{
      this.tripData=startedTripData;
      // console.log('check trip data >>>>>>>',this.tripData);
      let to = new google.maps.LatLng(this.tripData.pick_latitude, this.tripData.pick_longitude);
      let from = new google.maps.LatLng(this.tripData.drop_latitude, this.tripData.drop_longitude);
      this.calculateAndDisplayRoute(to,from,this.tripData);
    })
  }


  ionViewDidLoad() {
    this.storage.get('userData').then(userData=>{
      this.initMap();
      this.userData = JSON.parse(userData);
      if (this.interval){
        clearInterval(this.interval);
      }
      this.interval = setInterval(()=>{
        this.updateDriverLocation();
      },5000)
    })
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

  notificaion(){
    this.navCtrl.push("NotificationsPage");
  }

  chat(){
    let customer = {
      date_of_join:new Date().getTime(),
      id:this.tripData.customer_id+'_C',
      image:this.tripData.image,
      isDriver:false,
      name:this.tripData.first_name+' '+this.tripData.last_name
    }
    this.firedb.addUser(customer,this.userData.id+'_D');
    let chatRef = this.tripData.customer_id+'_C'+'-'+this.userData.id+'_D';
    this.navCtrl.push('ChatPage',{chatRef:chatRef,customer:customer,driver:this.userData});
  }

  calculateAndDisplayRoute(from, to, allData:any) {
    const that = this;
    this.directionsService.route({
      origin:from,
      destination:to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.lat1=allData.pick_latitude;
        that.long1=allData.pick_longitude;
        that.lat2=allData.drop_latitude;
        that.long2=allData.drop_longitude;
        that.directionsDisplay.setDirections(response);
        that.loadMap();
      }
    });
  }
  loadMap(){
    let startMarker = new google.maps.Marker({ position: {
        lat:parseFloat(this.lat1),
        lng:parseFloat(this.long1)
      }, map: this.map, icon: 'assets/img/truck-map.png' });

    startMarker = new google.maps.Marker({position: {
        lat:parseFloat(this.lat2),
        lng:parseFloat(this.long2)
      }, map: this.map, icon: 'assets/img/green-dot.png' });

    this.directionsDisplay.setMap(this.map,startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#752264'
      },
      suppressMarkers: true
    });
    // this.addMarker()
  }

  initMap(){
    let mapOptions = {
      zoom: 7,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  updateDriverLocation() {
    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
      let rawData = {
        "user_id":this.userData.id,
        "latitude":resp.coords.latitude,
        "longitude":resp.coords.longitude,
        "user_type":"2"
      }
      this.user.updateLatLng(rawData).subscribe(res => {
        // console.log(this.tripData);
        this.tripData.pick_latitude = resp.coords.latitude;
        this.tripData.pick_longitude = resp.coords.longitude;
        let to = new google.maps.LatLng(this.tripData.pick_latitude, this.tripData.pick_longitude);
        let from = new google.maps.LatLng(this.tripData.drop_latitude, this.tripData.drop_longitude);
        this.calculateAndDisplayRoute(to,from,this.tripData);
      }, error => {
        console.log(error);
      })
    });
  }

  call() {
    if (this.tripData.mobile && this.tripData.mobile !== ''){

    }else {
      this.util.presentToast('Currently customer mobile number is not available');
    }
  }

  end(){
    this.util.presentConfirm('Trip End','Are you sure want to end the trip?').then(()=>{
      this.util.presentLoader();
      let data = {
        "driver_id":this.userData.id,
        "booking_id":this.tripData.id,
        "latitude":"",
        "longitude":"",
        "trip_status":"2"
      }
      this.user.tripStartEnd(data).subscribe(res=>{
        let resp : any =res;
        if (resp.status){
          this.storage.set('startedTripData',null).then(()=>{
            this.navCtrl.setRoot("MenuPage");
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
