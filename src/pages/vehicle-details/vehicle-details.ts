import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-vehicle-details',
  templateUrl: 'vehicle-details.html',
})
export class VehicleDetailsPage {

  requestData :any = {
    fullName:'',
    email:'',
    address:'',
    mobileNumber:'',
    password:'',
    fcm_token:''
  }
  vehicleRegistraion: any = '';
  drivingLicence: any = '';
  insuranceDoc: any = '';
  backgroundCheck: any = '';
  vehicleProfile: any = '';
  vehicleNumber: any = '';
  vehicleType: any = '';
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public storage:Storage,
              public navParams: NavParams) {
    this.requestData = navParams.data.requestData;
  }

  ionViewDidLoad() {
  }

  save(){
    if (this.validate()){
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('full_name',this.requestData.fullName);
      formData.append('email',this.requestData.email);
      formData.append('address',this.requestData.address);
      formData.append('phone_number',this.requestData.mobileNumber);
      formData.append('password',this.requestData.password);
      formData.append('fcm_token',this.requestData.fcm_token);
      formData.append('vehicle_registration',this.vehicleRegistraion);
      formData.append('driving_licence',this.drivingLicence);
      formData.append('insurance_doc',this.insuranceDoc);
      formData.append('vehicle_image',this.vehicleProfile);
      formData.append('background_check',this.backgroundCheck);
      formData.append('vehiclenumber',this.vehicleNumber);
      formData.append('vehicle_type',this.vehicleType);

      this.user.signup(formData).subscribe(res=>{
        let resp :any = res;
        this.util.presentAlert('',resp.message);
        if (resp.status){
          this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
            this.navCtrl.setRoot('MenuPage');
          });
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500);
      },error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }
  }
  vehicleRegistraionEvent(event) {
    this.vehicleRegistraion = event.target.files[0];
  };
  insuranceDocEvent(event) {
    this.insuranceDoc = event.target.files[0];
  };
  drivingLicenceEvent(event) {
    this.drivingLicence = event.target.files[0];
  };
  backgroundCheckEvent(event) {
    this.backgroundCheck = event.target.files[0];
  };
  vehicleProfileDocEvent(event) {
    this.vehicleProfile = event.target.files[0];
  };

  validate() {
    if (this.vehicleRegistraion == ''){
      this.util.presentToast('Please add Vehicle Registration');
      return false;
    }
    if (this.drivingLicence == ''){
      this.util.presentToast('Please add your Driving Licence');
      return false;
    }
    if (this.insuranceDoc == ''){
      this.util.presentToast('Please add Vehicle Insurance');
      return false;
    }
    if (this.backgroundCheck == ''){
      this.util.presentToast('Please add Background Check');
      return false;
    }
    if (this.vehicleProfile == ''){
      this.util.presentToast('Please add Vehicle Profile');
      return false;
    }
    if (this.vehicleNumber == ''){
      this.util.presentToast('Please add Vehicle Number');
      return false;
    }
    if (this.vehicleType == ''){
      this.util.presentToast('Please add Vehicle Type');
      return false;
    }
    return true;
  }
}
